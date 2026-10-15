#!/usr/bin/env bun
/**
 * Import all memories from Cursor Agentmemory MCP export into III Docker agentmemory
 * 
 * Usage: bun import-to-agentmemory.mjs
 */

const III_API = process.env.AGENTMEMORY_URL || 'http://localhost:3311';
const VIEWER_URL = process.env.AGENTMEMORY_VIEWER_URL || 'http://localhost:3313';

const memories = [
  {
    type: 'architecture',
    content: `# MU Platform Backend Bible (v3.0.0) — Master Reference

## Core Architecture
- Military Strict, God-Elite, Zero Compromise
- 4-Tier DDD: API Layer (Controllers) → CQRS Layer (Command/Query/Event Bus) → Domain Layer (Services) → Data Layer (Repositories)
- Bun v1.3.14 runtime, NestJS, TypeScript
- MongoDB (Mongoose) primary DB, Redis (IORedis) cache, RabbitMQ messaging
- Neo4j graph DB, Qdrant vector DB for specialized use cases
- Hybrid C1+C3: Transactional Outbox + CQRS Saga

## Service Port Matrix
- 3000-3009: Infrastructure (mu-infra-runtime:3000, mu-fusion:3001, mu-agenda:3002, mu-vg:3009)
- 3010-3019: Core Platform (mu-sts:3010, mu-tenant:3011, mu-profile:3012)
- 3015: mu-discovery, 3019: mu-communication
- 3020-3099+: Business Domain (mu-byngo:3020, mu-chat:3021, mu-booking:3022, mu-crm:3023, mu-kpi:3024, mu-recruitment:3025, mu-analytics:3026, mu-workflow:3039)

## Document Index
- 00-mu-bible.md: Master Index (this)
- 01-technical-standards.md: Core coding standards, 4-tier architecture, CQRS conventions
- Infrastructure: port allocation, mu-fusion API, hybrid index mgmt, outbox cleanup/relay
- Security: OWASP, Traefik gateway, STS resilience
- Messaging: RMQ integration guide, saga orchestration, registry topology
- Log: MSXLog schema, VictoriaLogs/Grafana architecture
- Patterns: distributed transactions, CQRS layering, command/event contracts, strategy discovery, outbox loopback
- Scaffolding: service creation, feature module standard, docker infra
- Business Domains: tenant, profile, communication, chat, KPI, catalog, booking, discovery, activity stream, BPMN, transport, keycloak, AI
- ADRs: Actor Taxonomy & ABAC (014), Identity Access Context Mirror (015)
- Research: low-code workflow, hybrid multitenancy, BPMN analysis, multi-agent MCP, tenant isolation, multi-region architecture`,
    concepts: ['mu-bible', 'platform-architecture', '4-tier-ddd', 'port-matrix', 'service-mesh', 'microservices']
  },
  {
    type: 'architecture',
    content: `# MU Platform Technical Standards (v2.1.1)

## Infrastructure Architecture
- @mu/infra core package: MongoDB, Redis, RabbitMQ, Reliability (Outbox), Security, Context, Observability, i18n
- Specialized adapters: @mu/db-keycloak, @mu/db-neo4j, @mu/db-vector
- tsconfig paths map to ../mu-infra-lib/src for dev, ../mu-infra-lib/dist for build
- Symlink strategy (dev:prep): ln -s service node_modules to library node_modules

## Runtime & Import Rules
- Bun v1.3.14 mandatory. Direct TS execution: bun src/main.ts
- FORBIDDEN: import { Connection, Model } from mongoose (named exports fail in Bun)
- MANDATORY: import mongoose from 'mongoose' (default import for runtime), import type { Connection, Model } for types
- 3-stage multi-stage Docker: infra-builder → app-builder → runtime
- MsxFactory.create() with enableHelmet, enableBlacklist, enableWaf

## 4-Tier Architecture (Golden Standards)
### Tier 1 - API Layer: Controllers return Promise<ResponseModel>. NO business logic.
### Tier 2 - CQRS Layer: Unified Action folders (commands/, queries/, events/). Handlers orchestrate flow.
### Tier 3 - Domain Layer: Services extend BaseScopeAwareService. Strategy Pattern via Factory.
### Tier 4 - Data Layer: Repositories extend GenericRepository<T>. Golden Provider pattern (token-based injection, no @InjectModel).

## CQRS & Saga
- Write flow: Controller → CommandBus → CommandHandler → Service → Repository + Outbox.enqueue
- Hybrid C1+C3: Transactional Outbox + CQRS Saga
- Event handlers must NOT use RequestContextService (ALS); source context from event.access

## Security - 4-Layer Shields
- Layer 1: BlacklistShield (static config + Redis BLACKLIST:IP:<ip>)
- Layer 2: HelmetShield (HSTS, CSP, NoSniff)
- Layer 3: WafShield (NoSQL injection $/. stripping, HPP prevention)
- Layer 4: RateLimitShield (IP or UserID based)

## 12 Golden Coding Standards
1. Strict import path aliasing (@/ @modules/ @shared/) - no ../ outside domain
2. Explicit CQRS payloads: constructor(access, payload: ExplicitClass)
3. Static Event PATTERN: public static readonly PATTERN = 'domain.action.event'
4. 4-Tier DDD separation
5. Context Propagation (access: AccessContext) end-to-end
6. Parallel Outbox: Promise.all([...enqueues]) before commit
7. Audit: ActivityEngine.seal + AuditLogEvent.PATTERN
8. Triple-Lock sharding
9. No msx.internal primary binding
10. No @InjectModel/@InjectConnection
11. Bun-compatible mongoose imports
12. Active vs Quiet Loopback Controllers`,
    concepts: ['technical-standards', '4-tier-architecture', 'cqrs', 'saga', 'outbox', 'bun-compatible-imports', 'mongoose', 'security-shields']
  },
  {
    type: 'architecture',
    content: `# MU Platform Scaffolding Standards

## Service Scaffolding
- Service folder structure: src/@modules/, src/core/(database/, health/, message-bus/, redis/, security/)
- src/main.module.ts, src/main.ts (MsxFactory.create), src/module.list.ts
- environments/.env.local, .env.dev, .env.prod with PORT, SERVICE_NAME, HOST_ENV, MONGODB_URL, MESSAGE_BUS_URL
- tsconfig.json maps @mu/infra to ../mu-infra-lib/src (dev)
- tsconfig.build.json maps to ../mu-infra-lib/dist (prod)
- Dockerfile: 3-stage multi-stage build
- dev:prep script symlinks node_modules

## Feature Module Standard
- File naming: [feature].[tier].module.ts (.data.module, .core.module, .api.module, .cqrs.module)
- 4-Tier DDD: API (controllers) → CQRS (commands/queries/events with handlers) → Domain (services) → Data (repositories/schemas)
- Controllers return Promise<ResponseModel>. Use CommandBus/QueryBus.
- Soft Delete with Integrity Check. CUD operations with session.transaction.
- DTO Triad: @ApiProperty, @Expose, class-validator decorators
- @Transform with .trim() sanitization on all string inputs

## Docker Infra Foundation
- Dockerfile: 3-stage (infra-builder → app-builder → runtime)
- Golden-Link symlink mapping in Stage 3 (ln -sf)
- Hardened controls: copy environments + config, USER bun, non-root, healthcheck

## Port Allocation
- INFRASTRUCTURE 3000-3009: mu-infra-runtime:3000, mu-fusion:3001, mu-agenda:3002, mu-vg:3009
- CORE 3010-3019: mu-sts:3010, mu-tenant:3011, mu-profile:3012, mu-discovery:3015, mu-communication:3019
- BUSINESS 3020+: mu-byngo:3020, mu-chat:3021, mu-booking:3022, mu-crm:3023, mu-kpi:3024, mu-recruitment:3025, mu-analytics:3026, mu-workflow:3039`,
    concepts: ['scaffolding', 'feature-module', 'docker-multi-stage', 'port-allocation', '4-tier-ddd']
  },
  {
    type: 'architecture',
    content: `# MU Platform Messaging & Transport Standards

## RabbitMQ Integration Guide
- 5-minute integration: define message-routes-config.json with channels and routes
- Channel types: subscription, broadcast
- Route types: listened (inbound) and dispatched (outbound)
- listenedMessageRoutes: NO msx.internal primary. Use wildcards {domain}.*.event on correct channel.
- dispatchedMessageRoutes: Declare explicit routingKey.
- All domain events MUST have .event suffix. 4-segment RMQ keys: {Domain}.{Entity}.{Action}.{Event-Type}
- Exception: activity.audit.event is a flat key
- @ExternalMessageHandler decorator for RabbitMQ consumers
- prefetch(10), durable exchanges with publisher confirms, DLQ

## Saga Orchestration
- @Saga() decorator with RxJS observables
- ofType filter, delay(100) for DB propagation
- map event → new BroadcastTopologySignalCommand
- Exponential backoff: up to 3 attempts, 2^attempt seconds delay
- Saga-CRITICAL logging for unrecoverable failures

## Registry Topology
- mu-fusion: dynamic topology registry via DB
- Hot-reload: Broadcast (Fanout) RMQ signals for runtime config changes
- Static JSON config for resilience fallback

## Distributed Transaction Patterns
- C1 (Transactional Outbox): events in same ACID transaction. Zero data loss.
- C2 (Event Handler): for social/rating flows
- C3 (Saga Orchestrator): multi-step compensation
- Hybrid C1+C3: payment/booking flows
- triggerProcess() after commit: Redis Pub/Sub primary, 5s polling fallback

## Outbox Loopback Flow
- Active Loopback: translates RMQ messages to internal CQRS commands for saga continuation
- Quiet Loopback: replica sync only, no saga trigger
- Outbox enqueues run in parallel via Promise.all before transaction commit

## CQRS Command/Event Contracts
- Explicit Payload Classes. Standard constructor: constructor(access: AccessContext, payload: ExplicitPayloadClass)
- Static PATTERN property on every Event class
- ICommand/IQuery/IEvent from @nestjs/cqrs

## Strategy Discovery Pattern
- Decorator-Driven Discovery (@NotificationStrategy etc.)
- StrategyFactory implements OnModuleInit, uses DiscoveryService + Reflector`,
    concepts: ['rabbitmq', 'messaging', 'saga', 'outbox', 'cqrs-contracts', 'strategy-pattern', 'loopback']
  },
  {
    type: 'architecture',
    content: `# MU Platform Multi-Tenancy & Security Standards

## Multi-Tenancy Architecture
- Hybrid model: shared schema (default, tenantId filtering) → isolated DB (Enterprise tier, dynamic routing)
- Event-driven provisioning: TenantProvisionedEvent triggers DB/schema creation
- Tenant → Organization → User hierarchy
- Scope Isolation: Triple-Lock Isolation, Scope Taxonomy, IScopedEntity
- Subscription System: dynamic sharding, upgrade/downgrade flows

## Actor Taxonomy & ABAC (ADR-ACTOR-001)
- GUEST, VIEWER, BUYER vs SELLER, BUSINESS
- PartyRole model (Amazon-style identity)
- ABAC: Attribute-Based Access Control

## MongoDB Entity Identity (ADR-IDENT-001)
- Primary Key: MongoDB ObjectId _id (BSON)
- Canonical spine: entityId = _id.toString() — used in events, Outbox, Redis, Neo4j, Qdrant
- Optional business keys: code, externalId, correlationId with unique sparse indexes
- API serialization: SchemaConfig maps _id → response field id
- No UUID. Pre-generate ObjectId via new mongoose.Types.ObjectId() when ID needed before insert

## Security Standards
- 4-Layer Defense: Network (Blacklist) → Transport (Helmet) → Application (WAF) → Traffic (RateLimit)
- Global protection via MsxFactory.create with enableHelmet, enableBlacklist, enableWaf
- @Throttle on sensitive endpoints

## Traefik Gateway
- Edge security routing, forwardAuth mechanism to mu-sts
- 16 tenant headers propagation
- ContextHydrator extracts from HTTP headers`,
    concepts: ['multitenancy', 'security', 'abac', 'entity-identity', 'mongodb-objectid', 'traefik', 'sts-resilience']
  },
  {
    type: 'architecture',
    content: `# MU Platform Log & Observability Standards

## MSXLog Technical Specification
- Standardized JSON log schema for ELK/VictoriaLogs
- Fields: timestamp, level, service, tenantId, userId, traceId, message, data, error
- Log levels: DEBUG, INFO, WARN, ERROR, AUDIT
- Automatic masking of sensitive fields

## Log Architecture
- Components: MSXLogger (service-side) → RabbitMQ → mu-vg → VictoriaLogs → Grafana
- 3 layers: Log generation (services via MSXLogger), Log transport (RMQ), Log storage & query (VictoriaLogs + Grafana)

## Log Grafana Guide
- Query LogsQL syntax for VictoriaLogs
- Filter patterns: _stream={service}, _time=[start,end]
- Dashboard configuration per service

## Outbox Cleanup & Agenda
- OutboxCleanupWorker: runs on setInterval(OUTBOX_CLEANUP_INTERVAL_MS) default 1h
- Removes PROCESSED/FAILED records older than OUTBOX_RETENTION_DAYS (default 7)

## Outbox Relay Redis Trigger
- ENABLE_OUTBOX_REDIS_TRIGGER=true: Redis Pub/Sub backplane
- Primary trigger: Redis Pub/Sub (HA multi-pod), Fallback: 5s polling
- Call outboxRelay.triggerProcess() after commitTransaction

## Hybrid Index Management
- DB_INDEX_STRATEGY=background (default): async createIndexes, non-blocking startup
- DB_INDEX_STRATEGY=manual: explicit index creation, controlled timing`,
    concepts: ['logging', 'victorialogs', 'grafana', 'msx-logger', 'observability', 'outbox-cleanup', 'redis-trigger', 'index-management']
  },
  {
    type: 'architecture',
    content: `# MU Platform Business Domain Overview

## mu-tenant (Port 3011) - Tenant & Organization management, multi-tenant provisioning
## mu-sts (Port 3010) - Identity/Auth/JWT, JWT issuance and validation, user registration
## mu-profile (Port 3012) - Profile management, Activity stream/ledger, Neural Activity Stream
## mu-communication (Port 3019) - Omnichannel notifications: Email, FCM Push, SMS, Presence via Redis MGET
## mu-discovery (Port 3015) - Search and discovery APIs, Experience hub orchestration
## mu-catalog - Catalog management API, Product/service catalog
## mu-booking (Port 3022) - Booking API spec, Scheduling engine
## mu-kpi (Port 3024) - KPI engine, bounded context vs mu-analytics (3026)
## mu-media - Media storage and delivery
## mu-chat (Port 3021) - Real-time chat, Active room management, Focus isolation
## mu-workflow (Port 3039) - BPMN 2.0 engine, Long-journey flows, Storage isolation
## mu-byngo (Port 3020) - Social features
## mu-crm (Port 3023) - Customer relationship management
## mu-recruitment (Port 3025) - HR and recruitment
## mu-fusion (Port 3001) - API Gateway/Registry, Service registry and topology management
## mu-agenda (Port 3002) - Job Scheduler, Cron jobs
## mu-analytics (Port 3026) - Cross-domain analytical queries`,
    concepts: ['business-domains', 'tenant', 'sts', 'profile', 'communication', 'discovery', 'catalog', 'booking', 'kpi', 'chat', 'workflow', 'byngo', 'crm', 'recruitment']
  },
  {
    type: 'architecture',
    content: `# MU Platform Activity Stream & AI Domain

## Neural Activity Stream Architecture
- Domain: mu-profile activity module
- Neural-inspired event processing pipeline
- Activity Ledger: immutable audit trail of events
- ActivityEngine.seal(): creates standardized activity records with policies
- Integration with Outbox for reliable delivery
- hydrateActivityContext: single pipeline aggregation to avoid N+1

## AI Domain - Phase 0: Discovery Overview
- AI strategy for MSX platform, Cognitive architecture

## AI Domain - Phase 1: Business Requirements
- AI features: RAG, semantic search, recommendation, intelligent agents
- Integration with mu-communication for AI-powered notifications

## AI Domain - Low-Level Design
- Detailed architecture for AI components
- Vector DB (Qdrant) integration via @mu/db-vector
- Neo4j graph integration via @mu/db-neo4j
- RAG pipeline: query → vector search → context assembly → LLM call

## AI Domain - Tier Routing Strategy
- Tier 0: rule-based/cached responses
- Tier 1: lightweight embedding models (local)
- Tier 2: mid-weight LLM (API)
- Tier 3: full reasoning (expensive LLM)
- Strategy Pattern with decorator-driven discovery

## AI Domain - Phase 2: MCP + ACP Production
- Model Context Protocol (MCP) integration
- Agent Communication Protocol (ACP)
- Production deployment of AI infrastructure

## AI Domain - Phase 3: Cognitive Platform
- Advanced cognitive features
- Multi-agent orchestration

## Keycloak Domain
- Identity management, SSO, federated identity, social login
- Realm configuration per tenant
- Integration with mu-sts for identity`,
    concepts: ['activity-stream', 'ai-domain', 'rag', 'vector-db', 'qdrant', 'neo4j', 'mcp', 'acp', 'keycloak', 'identity']
  },
  {
    type: 'architecture',
    content: `# MU Platform BPMN & Transport Domain

## BPMN (Domain 16) - Business Process Model and Notation
- BPMN 2.0 engine for workflow automation (mu-workflow:3039)
- Process definition, deployment, execution
- Human tasks, service tasks, gateways, events
- Token-based execution, process state persistence
- Long-journey flows: multi-day/multi-step process flows
- Saga integration for long-running processes
- Storage isolation: shared vs isolated per tenant

## Transport Domain (Domain 17)
- Transport and logistics: route optimization, fleet management, shipment tracking
- Real-time tracking, GPS integration
- Multi-leg journey orchestration
- MongoDB for primary data, Neo4j for route optimization, Redis for real-time tracking

## Omnichannel Notification Architecture
- Multi-channel notification delivery (Email, FCM Push, SMS)
- Template management, channel routing
- Two-Tier Engine: Abstract (infra) + Domain-specific (service)
- OmnichannelEngine.seal(RegistryPolicy)

## Presence Architecture
- Redis-based presence tracking: global:presence:user:{userId}
- Online/offline/away states with TTL-based expiry
- Ghost user detection and cleanup (Atomic Ghost Busting)
- Batch reads via MGET for performance

## Chat - Focus Isolation
- Active room focus management in multi-room chat
- Redis-based active room tracking`,
    concepts: ['bpmn', 'workflow', 'transport', 'notification', 'presence', 'chat', 'omnichannel']
  },
  {
    type: 'architecture',
    content: `# MU Platform ADR & Research Documents

## ADR-ACTOR-001: Actor Taxonomy & ABAC
- Decision: Implement PartyRole-based actor model (GUEST, VIEWER, BUYER, SELLER, BUSINESS)
- ABAC for fine-grained access control, Amazon-style identity model

## ADR-IDENT-002: Identity Access Context Mirror
- Dual identity store: Keycloak + MongoDB
- Keycloak for authentication, MongoDB for rich user profile

## Research: Low-Code Workflow Strategy
- Comparison: Node-RED vs BPMN 2.0
- Decision: BPMN 2.0 chosen for enterprise-grade workflow

## Research: Hybrid Multitenancy Workflow
- Data decomposition for hybrid multitenancy
- Dynamic connection routing for isolated DBs

## Research: BPMN Custom vs Open Source
- Decision: custom lightweight BPMN engine for MSX platform

## Research: Multi-Agent MCP Cognitive Strategy
- Multi-agent orchestration with MCP
- Cognitive architecture for distributed AI

## Research: Hybrid Tenant Isolation
- Shared DB (default) → isolated MongoDB per premium tenant
- Dynamic routing via middleware

## Research: Multi-Region Architecture
- Active-active, active-passive regional deployment
- Cross-region data replication

## Frontend: Angular 21 + Tailwind v4
- Tailwind v4 migration: @import tailwindcss instead of @tailwind directives
- CSS-first configuration, new utilities`,
    concepts: ['adr', 'research', 'actor-taxonomy', 'abac', 'identity-mirror', 'bpmn-research', 'hybrid-multitenancy', 'multi-region', 'multi-agent-mcp', 'tenant-isolation', 'angular', 'tailwind']
  },
  {
    type: 'architecture',
    content: `# build/docker/ — Docker Build & Kind Deployment Infrastructure

## Directory Structure
build/docker/ contains:
- README.md - Docker build system overview
- mu.deploy.sh - Main deployment orchestrator
- mu.deploy-core.sh - Deploy core services (catalog, communication, discovery, media, profile, sts, tenant)
- mu.deploy-business.sh - Deploy business services (workflow)
- 07-restart-kind.sh, 03-load-images-kind.sh, 06-tunnels.sh, cleanup-keep-agentmemory.sh
- agentmemory/ - Agentmemory Docker setup (README, docker-compose.yml, iii-config.docker.yaml, agentmemory-docker-only.sh)
- kind/core/ - Core service Kind deployments with scripts + manifests
- kind/business/mu-workflow/ - BPMN engine deployment
- kind/infra/ - Infrastructure deployments (MongoDB, RabbitMQ, Redis, Traefik, Keycloak, mu-agenda, mu-vg)

## Deployment Flow
- mu.deploy.sh → deploy-core then deploy-business
- Each service has: 01-deploy, 02-verify, 03-cleanup, 04-tunnel-start, 05-tunnel-stop scripts

## Core Service Env Pattern
All core services share: PORT, SERVICE_NAME, HOST_ENV, MONGODB_URL, AUTH_REDIS_URL, BUS_REDIS_URL, BUS_MQ_URL, LOG_MQ_URL, ENABLE_OUTBOX_RELAY=true, DB_INDEX_STRATEGY=background`,
    concepts: ['docker', 'kind', 'kubernetes', 'deployment', 'env-config', 'agentmemory-docker', 'core-services']
  },
  {
    type: 'architecture',
    content: `# build/docker/ — Infrastructure Deployments (Kind)

## MongoDB
- StatefulSet (3 replicas), Secret, Service, External Service
- Port 27017, Replicaset name: mongodb

## RabbitMQ (rmq)
- StatefulSet (1 replica), Port: 5672 (AMQP), 15672 (Management UI)
- Default user: guest/guest

## RabbitMQ VG (rmq-vg) - for VictoriaLogs transport
## RabbitMQ Notifier (rmq-notifier) - for notification delivery

## Redis - Three separate clusters:
- redis-auth: for STS/auth caching
- redis-business: for business data caching
- redis-discovery: for discovery/search caching
Each with Sentinel

## Traefik - Ingress with ConfigMap, Deployment, Middlewares
- Ports: 80, 443, 8080 (dashboard)
- Middlewares: rate limiting, header injection, forwardAuth

## Keycloak - Keycloak IdP with PostgreSQL DB
- Port: 8080 (Keycloak), 5432 (PostgreSQL)

## mu-agenda - ConfigMap, StatefulSet, Service. Port 3002
## mu-vg - ConfigMap, StatefulSet, Service. Port 3009

## mu-workflow - ConfigMap, StatefulSet, Service. Port 3039
## Dockerfile.local examples for catalog, communication, discovery, media - 3-stage multi-stage build`,
    concepts: ['kind-deployment', 'mongodb', 'rabbitmq', 'redis', 'traefik', 'keycloak', 'mu-agenda', 'mu-vg', 'dockerfile', 'arm64']
  },
  {
    type: 'fact',
    content: `# Installation & DevOps

## install-docker-arm64.sh
- Docker CE installation for Ubuntu 22.04 LTS (Jammy Jellyfish) on ARM64
- Steps: system update, add Docker GPG key, add Docker repository, install docker-ce packages
- Post-install: add user to docker group
- Verification: systemctl status docker, docker compose version, docker version`,
    concepts: ['installation', 'docker', 'arm64', 'ubuntu', 'devops']
  },
  {
    type: 'fact',
    content: `# Agentmemory Local Setup

## Docker Compose Stack
- build/docker/agentmemory/docker-compose.yml
- iii-engine Docker container runs on ports: 3111, 3112, 49134, 9464
- Data mounted from .agentmemory/ directory
- iii-config.docker.yaml points state to /data/state_store.db and stream to /data/stream_store
- iii-init container chowns data directory to user 65532:65532

## Running
- agentmemory-docker-only.sh: start, stop, status, logs, fg commands
- Start flow: docker compose up iii-engine, then host worker process with --no-engine flag
- Worker connects to engine via ws://localhost:49134
- Worker provides REST API at http://localhost:3111
- Viewer at http://localhost:3113

## Data Directory
- .agentmemory/state_store.db/ - memory state storage
- .agentmemory/stream_store/ - stream storage`,
    concepts: ['agentmemory', 'docker-compose', 'iii-engine', 'local-setup', 'data-storage']
  }
];

async function importAll() {
  let imported = 0;
  let errors = 0;

  for (const mem of memories) {
    try {
      const res = await fetch(`${III_API}/agentmemory/remember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: mem.content,
          type: mem.type,
          concepts: mem.concepts
        })
      });
      if (res.ok) {
        imported++;
        const title = mem.content.split('\n')[0].replace('# ', '').substring(0, 60);
        console.log(`[OK] Imported: ${title}...`);
      } else {
        const text = await res.text();
        console.log(`[ERR] ${res.status}: ${text.substring(0, 200)}`);
        errors++;
      }
    } catch (err) {
      console.log(`[ERR] ${err.message}`);
      errors++;
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Imported: ${imported}, Errors: ${errors}`);

  // Verify
  if (imported > 0) {
    const verify = await fetch(`${III_API}/agentmemory/memories`);
    const data = await verify.json();
    const count = Array.isArray(data) ? data.length : (data.memories ? data.memories.length : '?');
    console.log(`Total memories now in agentmemory: ${count}`);
    console.log(`Viewer: http://localhost:3113/#memories`);
  }
}

importAll().catch(console.error);

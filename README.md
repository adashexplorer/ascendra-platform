# Ascendra Platform

## AI-Powered Multi-Agent Career Preparation Platform

**Production-grade career intelligence platform for Senior SDETs, Java Backend Engineers, Software Engineers, and Technical Leads**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/status-beta-orange)]()

---

## Introduction

Ascendra is a production-grade, AI-powered multi-agent platform designed to revolutionize career preparation for technology professionals. Our system orchestrates specialized AI agents that work collaboratively to provide personalized career guidance, skill assessment, interview preparation, and job matching.

Unlike traditional career platforms that offer generic advice, Ascendra's agents adapt to each user's specific background, target roles, and learning style—delivering hyper-personalized career development pathways.

## Platform Overview

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Ascendra Platform                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   User CLI   │───▶│  API Gateway │───▶│Orchestration │                   │
│  └──────────────┘    │              │    │  Engine      │                   │
│                       └──────────────┘    └──────────────┘                    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐              │
│  │                    Agent Ecosystem                          │              │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐ │              │
│  │  │Job Matching│ │Resume Agent │ │Interview   │ │Skill    │ │              │
│  │  │Agent       │ │            │ │Prep Agent  │ │Analyzer │ │              │
│  │  └────────────┘ └────────────┘ └────────────┘ └─────────┘ │              │
│  └─────────────────────────────────────────────────────────────┘              │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐              │
│  │                Data & Learning Layer                        │              │
│  │  PostgreSQL • Redis • Vector DB • LLM Provider APIs         │              │
│  └─────────────────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 🎯 **Role-Specific Career Preparation**
- Senior SDET: Transition to AI/ML testing roles with cutting-edge test frameworks
- Java Backend Engineers: Cloud-native architecture mastery and system design excellence
- Software Engineers: Full-stack specialization paths with portfolio optimization
- Technical Leads: Leadership skill development and strategic career navigation

### 🔧 **Multi-Agent Orchestration**
- **Job Matching Agent**: Semantic similarity analysis between resumes and job postings
- **Resume Optimization Agent**: ATS-friendly formatting and keyword optimization
- **Interview Prep Agent**: Behavioral and technical interview simulation
- **Skill Analyzer Agent**: Dynamic skill gap identification and learning path generation
- **Mentorship Agent**: Smart mentor matching based on career trajectory and preferences

### 📊 **Real-Time Progress Tracking**
- Interactive dashboards with career momentum metrics
- Weekly AI-generated progress reports
- Skill confidence scoring and improvement visualization
- Achievement badges and milestone celebrations

### 🛠️ **Interactive Learning Environments**
- Monaco-based code editor with syntax highlighting
- Live coding practice with auto-grading
- WebRTC-powered mock interviews with AI feedback
- Spaced repetition learning system

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.10+ (for backend services)
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Clone the repository
git clone https://github.com/ascendra/ascendra-platform.git
cd ascendra-platform

# Start development environment
docker-compose up -d

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd backend && pip install -r requirements.txt
```

### For Specific Personas

#### Senior SDET
```bash
# Access SDET-specific learning paths
curl -X GET /api/v1/learning-paths/sdet-to-ai-testing

# Run AI testing simulation
curl -X POST /api/v1/agents/ai-testing-lab/start
```

#### Java Backend Engineer
```bash
# Initialize cloud-native pathway
curl -X POST /api/v1/profiles/cloud-native-engineering

# Access system design practice
curl -X GET /api/v1/agents/system-design/playground
```

#### Software Engineer
```bash
# Get full-stack specialization quiz
curl -X GET /api/v1/quizzes/fullstack-specialization

# Track algorithm proficiency
curl -X GET /api/v1/users/{id}/progress/algorithms
```

#### Technical Lead
```bash
# Start leadership development track
curl -X POST /api/v1/learning-paths/leadership-engineering

# Schedule peer mentoring session
curl -X POST /api/v1/agents/mentorship/schedule
```

## Documentation

| Document | Description |
|----------|-------------|
| [Vision.md](./Vision.md) | Product vision and long-term strategy |
| [ProductRequirements.md](./docs/ProductRequirements.md) | Comprehensive product requirements |
| [UserPersonas.md](./docs/UserPersonas.md) | Detailed user personas |
| [FunctionalRequirements.md](./docs/FunctionalRequirements.md) | System functions and specifications |
| [NonFunctionalRequirements.md](./docs/NonFunctionalRequirements.md) | Performance, security, and operational requirements |
| [MVPScope.md](./MVPScope.md) | MVP features and timeline |
| [FutureRoadmap.md](./FutureRoadmap.md) | Product evolution and roadmap |

## API Documentation

API documentation is available at `/docs/api/` or after running the server at `http://localhost:8000/docs`

### Core Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/agents/skill-match` - Skill-based job recommendations
- `POST /api/v1/interviews/schedule` - Mock interview scheduling
- `GET /api/v1/users/{id}/progress` - Progress dashboard data
- `POST /api/v1/resumes/analyze` - Resume feedback

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, TailwindCSS, Monaco Editor |
| **Backend** | FastAPI (Python), PostgreSQL, Redis |
| **AI/ML** | Llama 3-70B, Milvus Vector DB |
| **Infrastructure** | Docker, Kubernetes, Terraform, GitHub Actions |
| **Monitoring** | Prometheus, Grafana, Sentry |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Run tests
npm test && pytest

# Submit PR
git push origin feature/your-feature
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

For support, email support@ascendra.ai or join our Discord community.
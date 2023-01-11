## Infrastucture

### Overview

This is the Infra repository that controls the infrastructure for the Projekt. It is a collection of Terraform scripts that will create the following resources:

-   A VPC with 3 subnets
-  A NAT Gateway
-   An ECS cluster

---

### Infrastructure Design

![Infrastructure diagram]()


#### Infra design philosophy/decisions

Simplicity:
- Static website hosting for simple informational websites
- Using modular hosting services that serve pages over HTTPS (Netlify and GitHub Pages)

Reliability:
- CDN + Backup website hosting (Netlify)

Version Control/Logging
- Using Terraform to manage major pieces of infra
- Logging CDN access logs in S3
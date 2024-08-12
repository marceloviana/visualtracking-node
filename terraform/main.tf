module "ecs-service" {
  source  = "app.terraform.io/Nutrien-LATAM/simple-ecs-service/aws"
  version = "~>1.1.0"

  region             = var.region
  role               = var.role
  country            = var.country
  environment        = var.environment
  ecr-aws-account-id = var.ecr-aws-account-id
  iac_source         = var.iac_source

  serviceName        = "br-websocket-service"
  ingressContextPath = "/br-websocket*"
  healthPath         = "/health-check"
  add_secretsmanager_permissions = true
}

output "ecs_service_name" {
  value = module.ecs-service.ecs_service_name
}

output "ecs_cluster_prefix" {
  value = module.ecs-service.ecs_cluster_prefix
}

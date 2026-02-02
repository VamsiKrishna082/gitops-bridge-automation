resource "google_storage_bucket" "this" {
  name     = "atlantis-bucket-vamsi-test"
  location = "us-central1"

  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  labels = {
    environment = "dev"
    managed_by  = "terraform"
  }
}

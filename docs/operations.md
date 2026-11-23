# Operations

## Offsite repo mirror

Keep a copy of this repository off GitHub (Build Standard A35).

```bash
git remote add backup TODO(fill): codeberg, gitlab or self-hosted URL
git push backup --mirror
# or a dated bundle on a separate drive:
git bundle create ../human-synapse-bouton-lab-$(date +%Y%m%d).bundle --all
```

Mirror location: TODO(fill). Last refreshed: TODO(fill).

## Deploy and rollback

TODO(fill) or "not deployed". If deployed, add `deploy` and `rollback` recipes to the justfile.

## Data and backups

TODO(fill) or "stores no persistent data".

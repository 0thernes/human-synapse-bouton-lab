# Replication protocol

How anyone can reproduce the headline results of human-synapse-bouton-lab on their own machine. (Build Standard B43, B44.)

## Requirements

- Hardware: TODO(fill): CPU, RAM, GPU if any.
- OS: TODO(fill).
- Toolchain: pinned in the lockfiles and toolchain files in this repo.

## Steps

```bash
git clone https://github.com/0thernes/human-synapse-bouton-lab.git
cd human-synapse-bouton-lab
git checkout vX.Y.Z           # the release whose results you are checking
just setup
just reproduce                # writes results to results/
```

## Expected results

| Result | Expected value | Tolerance | Runtime |
|---|---|---|---|
| TODO(fill) | | | |

## Reporting

Open an issue with the bug form, choose finding class "problem" or "error" if results differ, and paste your environment and outputs. Successful replications are welcome too.

## Replication log

| Date | Who (person or independent agent) | Machine and OS | Version | Outcome | Link |
|---|---|---|---|---|---|

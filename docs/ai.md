# AI components

Only needed if the project calls or ships an AI model (Build Standard A40, B34). Delete otherwise and set `ai: false` in repo.yaml.

## Pinned models

| Use | Model id (exact, dated) | Params |
|---|---|---|
| TODO(fill) | provider/model@YYYY-MM-DD | temperature, max_tokens |

## Token and cost budget

| Budget | Limit | Enforced where |
|---|---|---|
| Per call | TODO(fill) tokens | |
| Per run | TODO(fill) | |
| Per month | TODO(fill) USD | |

## Evals

Eval cases live in evals/; scores are appended to evals/history.csv on every model or prompt change.

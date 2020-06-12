/*eslint-disable */
export function getAnalyticsResponse() {
  let resp = {
    timestamp: '2020-05-22T16:15:10.758576',
    baseline_assessment: {
      id: 'reviews-v2',
      request_count: Math.random() * (1500 - 1000) + 1000,
      criterion_assessments: [
        {
          id: '0',
          metric_id: 'iter8_error_count',
          statistics: {
            value: Math.random() * (25 - 20) + 20,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 3,
                upper: 56
              },
              probability_of_beating_baseline: 23,
              probability_of_being_best_version: 54,
              credible_interval: {
                lower: 32,
                upper: 90
              }
            }
          },
          threshold_assessment: {
            threshold_breached: false,
            probability_of_satisfying_threshold: 0.002
          }
        },
        {
          id: '1',
          metric_id: 'iter8_mean_latency',
          statistics: {
            value: Math.random() * (4 - 2) + 2,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 7,
                upper: 5
              },
              probability_of_beating_baseline: 0,
              probability_of_being_best_version: 0,
              credible_interval: {
                lower: 5,
                upper: 30
              }
            }
          },
          threshold_assessment: {
            threshold_breached: false,
            probability_of_satisfying_threshold: 0.04
          }
        },
        {
          id: '2',
          metric_id: 'iter8_error_rate',
          statistics: {
            value: Math.random() * (0.2 - 0.1) + 0.1,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 7,
                upper: 5
              },
              probability_of_beating_baseline: 0,
              probability_of_being_best_version: 0,
              credible_interval: {
                lower: 5,
                upper: 30
              }
            }
          },
          threshold_assessment: {
            threshold_breached: true,
            probability_of_satisfying_threshold: 0.02
          }
        }
      ],
      win_probability: 0.5
    },
    candidate_assessments: [
      {
        id: 'reviews-v3',
        request_count: Math.random() * (1000 - 900) + 900,
        criterion_assessments: [
          {
            id: '0',
            metric_id: 'iter8_error_count',
            statistics: {
              value: Math.random() * (25 - 15) + 15,
              ratio_statistics: null
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 0.4
            }
          },
          {
            id: '1',
            metric_id: 'iter8_mean_latency',
            statistics: {
              value: Math.random() * (2 - 1) + 1,
              ratio_statistics: {
                improvement_over_baseline: {
                  lower: 34,
                  upper: 54
                },
                probability_of_beating_baseline: 0.5,
                probability_of_being_best_version: 0.7,
                credible_interval: {
                  lower: 23,
                  upper: 30
                }
              }
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 2
            }
          },
          {
            id: '2',
            metric_id: 'iter8_error_rate',
            statistics: {
              value: Math.random() * (0.09 - 0.08) + 0.08,
              ratio_statistics: {
                improvement_over_baseline: {
                  lower: 0.7,
                  upper: 53
                },
                probability_of_beating_baseline: 32,
                probability_of_being_best_version: 34,
                credible_interval: {
                  lower: 43,
                  upper: 60
                }
              }
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 0.3
            }
          }
        ],
        win_probability: 0.5,
        rollback: false
      }
    ],
    traffic_split_recommendation: {
      uniform: {
        'reviews-v3': 60,
        'reviews-v2': 40
      },
      random: {
        'reviews-v3': 30,
        'reviews-v2': 70
      }
    },
    winner_assessment: {
      winning_version_found: false,
      current_winner: '',
      winning_probability: 0.0
    },
    status: [],
    status_interpretations: {},
    last_state: {}
  }
  return resp
}
/* eslint-enable */

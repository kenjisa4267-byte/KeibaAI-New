

/* =================================

   KEIBA AI V2.2

   過去5走対応・総合評価予想エンジン

================================= */

window.KeibaAI = {

  version: "2.2",

  predict: function(horses) {

    if (!Array.isArray(horses) || horses.length < 2) {

      return [];

    }

    const factors = [

      { key: "recentRuns", fallback: "recent", weight: 0.35 },

      { key: "course", weight: 0.25 },

      { key: "style", fallback: "pace", weight: 0.20 },

      { key: "jockey", weight: 0.20 }

    ];

    const results = horses.map((horse, index) => {

      let total = 0;

      let breakdown = {};

      factors.forEach(factor => {

        let value;

        if (factor.key === "recentRuns") {

          if (Array.isArray(horse.recentRuns) &&

              horse.recentRuns.length > 0) {

            const runs = horse.recentRuns

              .map(Number)

              .filter(v => Number.isFinite(v) && v >= 1 && v <= 10);

            value = runs.length

              ? runs.reduce((a, b) => a + b, 0) / runs.length

              : horse.recent;

          } else {

            value = horse.recent;

          }

        } else {

          value = horse[factor.key];

          if (value === undefined && factor.fallback) {

            value = horse[factor.fallback];

          }

        }

        value = Number(value);

        if (!Number.isFinite(value) || value < 1 || value > 10) {

          value = 5;

        }

        breakdown[factor.key] = Math.round(value * 100) / 100;

        total += value * factor.weight;

      });

      return {

        ...horse,

        score: Math.round(total * 100) / 100,

        breakdown: breakdown,

        originalIndex: index,

        evaluation: "暫定評価"

      };

    });

    results.sort((a, b) =>

      b.score - a.score ||

      a.originalIndex - b.originalIndex

    );

    results.forEach((horse, index) => {

      horse.rank = index + 1;

    });

    return results;

  }

};

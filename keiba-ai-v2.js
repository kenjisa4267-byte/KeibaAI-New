

/* =================================

   KEIBA AI V2.1

   総合評価予想エンジン

================================= */

window.KeibaAI = {

  version: "2.1",

  predict: function(horses) {

    if (!Array.isArray(horses) || horses.length < 2) {

      return [];

    }

    const factors = [

      { key: "recent", fallback: "ability", weight: 0.35 },

      { key: "course", weight: 0.25 },

      { key: "style", fallback: "pace", weight: 0.20 },

      { key: "jockey", weight: 0.20 }

    ];

    const results = horses.map((horse, index) => {

      let total = 0;

      let breakdown = {};

      factors.forEach(factor => {

        let value = horse[factor.key];

        if (value === undefined && factor.fallback) {

          value = horse[factor.fallback];

        }

        value = Number(value);

        if (!Number.isFinite(value) || value < 1 || value > 10) {

          value = 5;

        }

        breakdown[factor.key] = value;

        total += value * factor.weight;

      });

      return {

        ...horse,

        score: Math.round(total * 100) / 100,

        breakdown: breakdown,

        originalIndex: index,

        evaluation: "手入力評価による暫定予想"

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

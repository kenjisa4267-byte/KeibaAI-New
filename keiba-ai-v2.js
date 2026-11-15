

/* =================================

   KEIBA AI V2

   競馬予想エンジン

================================= */

window.KeibaAI = {

  version: "2.0",

  predict: function(horses) {

    const results = horses.map(horse => {

      const recent = Number(horse.recent || 5);

      const course = Number(horse.course || 5);

      const style = Number(horse.style || 5);

      const jockey = Number(horse.jockey || 5);

      // 基礎能力評価

      let score =

        recent * 0.35 +

        course * 0.25 +

        style * 0.20 +

        jockey * 0.20;

      return {

        ...horse,

        score: Math.round(score * 100) / 100

      };

    });

    // 総合評価順に並べる

    results.sort((a, b) => b.score - a.score);

    // 予想順位を付ける

    results.forEach((horse, index) => {

      horse.rank = index + 1;

    });

    return results;

  }

};
import React from "react";

const Otsikko = ({nimi}) => {
  return (
    <div>
      <h2>{nimi}</h2>
      <h3>Sisältö</h3>
    </div>
  );
};

const Sisalto = ({nimi, tehtavia}) => {
  return (
    <li>
      <Osa osa={nimi} tehtavia={tehtavia} />
    </li>
  );
};

const Osa = ({osa, tehtavia}) => {
  return (
    <div>
      {osa}, tehtäviä {tehtavia}
    </div>
  );
};

const Yhteensa = ({osat}) => {
  return (
    <div>
      <p>
        Yhteensä {osat.map((osa) => osa.tehtavia).reduce((a, b) => a + b)}{" "}
        tehtävää.
      </p>
    </div>
  );
};

const Kurssi = ({kurssi}) => {
  return (
    <div>
      <Otsikko nimi={kurssi.nimi} />
      <ul>
        {kurssi.osat.map((kurssi) => (
          <Sisalto
            key={kurssi.id}
            nimi={kurssi.nimi}
            tehtavia={kurssi.tehtavia}
          />
        ))}
      </ul>
      <Yhteensa osat={kurssi.osat} />
    </div>
  );
};

export default Kurssi;

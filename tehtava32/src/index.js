import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      filter: ""
    };
  }

  componentWillMount() {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      this.setState({countries: response.data});
    });
  }

  filterCountries() {
    if (this.state.filter.length > 0) {
      return this.state.countries.filter((country) =>
        country.name.toLowerCase().includes(this.state.filter.toLowerCase())
      );
    } else {
      return [];
    }
  }

  handleChange = (e) => this.setState({filter: e.target.value});

  asetaFiltteriin = (arvo) => {
    return () => {
      this.setState({filter: arvo});
    };
  };

  render() {
    return (
      <div>
        <form>
          find countries:{" "}
          <input value={this.state.filter} onChange={this.handleChange} />
        </form>
        <div>
          <Countries
            countries={this.filterCountries()}
            handleClick={this.asetaFiltteriin}
          />
        </div>
      </div>
    );
  }
}

const Countries = ({countries, handleClick}) => {
  if (countries.length > 10) {
    return <div>too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return countries.map((country) => (
      <Country
        key={country.name}
        name={country.name}
        handleClick={handleClick}
      />
    ));
  } else {
    return countries.map((country) => (
      <SingleCountry
        key={country.name}
        name={country.name}
        nativeName={country.nativeName}
        capital={country.capital}
        population={country.population}
        flag={country.flag}
      />
    ));
  }
};

const Country = ({name, handleClick}) => (
  <div onClick={handleClick(name)}>{name}</div>
);

const SingleCountry = ({name, nativeName, capital, population, flag}) => {
  return (
    <div>
      <h2>
        {name} {nativeName}
      </h2>
      <p>capital: {capital}</p>
      <p>population: {population}</p>
      <img src={flag} height="200" border="1" alt="national flag" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

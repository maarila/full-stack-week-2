import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      filter: ""
    };
  }

  componentWillMount() {
    axios.get("http://localhost:3001/persons").then((response) => {
      this.setState({persons: response.data});
    });
  }

  addPerson = (e) => {
    e.preventDefault();

    if (this.checkPersonIsUnique()) {
      const personObject = {
        name: this.state.newName,
        number: this.state.newNumber
      };
      axios
        .post("http://localhost:3001/persons", personObject)
        .then((response) => {
          this.setState({
            persons: this.state.persons.concat(response.data)
          });
        });
    }

    this.setState({
      newName: "",
      newNumber: ""
    });
  };

  checkPersonIsUnique = () =>
    this.state.persons.filter(
      (person) => person.name.toLowerCase() === this.state.newName.toLowerCase()
    ).length === 0;

  filterList = () =>
    this.state.persons.filter((person) =>
      person.name.toLowerCase().includes(this.state.filter.toLowerCase())
    );

  handlePersonChange = (e) => {
    this.setState({newName: e.target.value});
  };

  handleNumberChange = (e) => {
    this.setState({newNumber: e.target.value});
  };

  handleSearchChange = (e) => {
    this.setState({filter: e.target.value});
  };

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Rajaus
          filter={this.state.filter}
          handleChange={this.handleSearchChange}
        />
        <h3>Lisää uusi</h3>
        <form onSubmit={this.addPerson}>
          <div>
            nimi:{" "}
            <input
              value={this.state.newName}
              onChange={this.handlePersonChange}
            />
            <br />
            numero:{" "}
            <input
              value={this.state.newNumber}
              onChange={this.handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">lisää</button>
          </div>
        </form>
        <h3>Numerot</h3>
        <Numerot persons={this.filterList()} />
      </div>
    );
  }
}

const Rajaus = ({filter, handleChange}) => {
  return (
    <div>
      <div>
        rajaa näytettäviä <input value={filter} onChange={handleChange} />
      </div>
    </div>
  );
};

const Numerot = ({persons}) => {
  return (
    <table>
      <tbody>
        {persons.map((person) => (
          <Person
            key={person.name}
            person={person.name}
            number={person.number}
          />
        ))}
      </tbody>
    </table>
  );
};

const Person = ({person, number}) => {
  return (
    <tr>
      <td>{person}</td>
      <td>{number}</td>
    </tr>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

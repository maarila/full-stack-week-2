import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [
        {
          name: "Arto Hellas",
          number: "050-12345678"
        }
      ],
      newName: "",
      newNumber: "",
      filter: ""
    };
  }

  addPerson = (e) => {
    e.preventDefault();
    if (this.checkPersonIsUnique()) {
      const personObject = {
        name: this.state.newName,
        number: this.state.newNumber
      };

      const persons = this.state.persons.concat(personObject);

      this.setState({
        persons,
        newName: "",
        newNumber: ""
      });
    } else {
      this.setState({
        newName: "",
        newNumber: ""
      });
    }
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
    <div>
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
    </div>
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

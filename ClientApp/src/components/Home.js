import React, { Component } from 'react';
import {Spinner, Button, FormGroup, Input, Card, CardText, CardBody,
  CardTitle, Label} from 'reactstrap'

export class Home extends Component {
  static displayName = Home.name;

  constructor(props){  
    super(props);  
    this.state = {  
         loading : true,
         fetching : false,
         varugrupper : [],
         varor : [],
         varuIndex : 0,
         selectionChanged : false,
         displayFilter : false,
         error : false,
         filter : {},
         maxPrice : 0,
      }
      this.randomizeBeverage = this.randomizeBeverage.bind(this);
    }

    componentDidMount(){
      document.body.style.background = 'linear-gradient(#414141, #000000)';
      document.body.style.minHeight = '100vh';
      document.body.style.fontFamily = 'Didact Gothic, sans-serif';

      if(!this.state.fetching){
        this.getVarutyper(0);
      }
    }

  render () {
    let content = "";
    let beverage = "";
    let filter = "";

    if(this.state.error){
      content = <div className="text-center text-white"><p>Unable to get data, try again..</p><Button onClick={() => window.location.reload()}>Try again</Button></div>
    } 
    else if(this.state.loading){
      content = this.renderLoading("Uppdaterar sortimentet");
    } 
    else {
      content = this.renderContent();
    }

    if(this.state.fetching){
      beverage = this.renderLoading("Slumpar dryck");
    } 
    else if(this.state.varor.length > 0){
      console.log(this.state.varor.length);
      console.log(this.state.varuIndex); 
      beverage = this.renderBeverage(this.state.varor[this.state.varuIndex]);
    }

    if(this.state.displayFilter){
      filter = this.renderFilter();
    }

    return (
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <h2 className="display-5 mt-5 text-white">SYSTEMETSLUMPAREN</h2>
        </div>
        {content}
        {filter}
        {beverage}
      </div>
    );
  }

  renderLoading(message){
  return(
    <div className="text-center mx-auto mt-5 text-white">
      <h3>{message}</h3>
      <Spinner color="success" className="mt-2"></Spinner>
    </div>
    )
  }

  renderBeverage(beverage){
    console.log(beverage);
    return(
      <div className="mt-5 w-75 mx-auto">
      <Card color="dark" className="text-white">
        <CardBody>
          <CardTitle className="text-center"><h3>{beverage.namn}</h3>
            <CardText>{beverage.stil}</CardText>
            <CardText>{beverage.prisinklmoms} kr</CardText>
            <hr></hr>
          </CardTitle>
          <dl>
            <dt>Typ:</dt>
            <dd>{beverage.typ}</dd>
            <dt>Alkoholhalt:</dt>
            <dd>{beverage.alkoholhalt}</dd>
            <dt>Förpacking:</dt>
            <dd>{beverage.forpackning}</dd>
            <dt>Volym:</dt>
            <dd>{beverage.volymiml} ml</dd>
            <dt>Urpsrungsland:</dt>
            <dd>{beverage.ursprunglandnamn}</dd>
          </dl>
        </CardBody>
      </Card>
    </div>)
  }

  renderFilter(){
    return(
    <div className="w-50 mx-auto text-white">
      <FormGroup>
        <Label>Maxpris</Label>
        <Input type="number" className="form-control" value={this.state.maxPrice} onChange={this.handleChange.bind(this)} placeholder="Maxpris"></Input>
      </FormGroup>
    </div>);
  }

  renderContent(filter){
    return(
    <div className="text-center mx-auto w-75">
        <FormGroup>
          <Input type="select" id="typSelect" className="form-control mt-2" onChange={() => this.setState({selectionChanged : true})}>
            {this.state.varugrupper.map(typ => <option key={typ}>{typ}</option>)}
          </Input>
          <Button className="btn-success mt-2"
            onClick={
              () => this.randomizeBeverage()}>
                Slumpa</Button>
        </FormGroup>
        {/* <Button onClick={() => this.toggleFilter()}>Filter</Button> */}
      </div>
    )
  }

  toggleFilter(){
    if(this.state.displayFilter){
      this.setState({displayFilter : false});
    } else {
      this.setState({displayFilter : true});
    }
  }

  handleChange(event){
    console.log(event.target.value);
    this.setState({maxPrice : event.target.value});
  }

  randomizeBeverage(){
    if(this.state.varor.length < 1 || this.state.selectionChanged){
      this.setState({fetching : true})
      let value = document.getElementById("typSelect").value;
      let options = {
        header : {
          "Ocp-Apim-Subscription-Key" : "77cf0aec827b4e67900fa3675429351f"
        }
      }
      fetch("https://systembolagetapimanagement.azure-api.net/produkter/" + value, options)
        .then(response => response.json())
        .then(jsonresponse => 
          {
            this.setState(
              {
                varuIndex : Math.floor(Math.random() * (jsonresponse.length)),
                varor : jsonresponse,              
                selectionChanged : false,
                fetching : false
              })
            })
          .catch(error => console.log(error));
      console.log(value);
    } else {
      this.setState({varuIndex : Math.floor(Math.random() * (this.state.varor.length))})
    }
  }

  getVarutyper(tries){
    if(this.state.varugrupper.length > 0){
      return;
    }
    if(tries < 10){
      this.setState({loading:true});
      let options = {
        header : {
          "Ocp-Apim-Subscription-Key" : "77cf0aec827b4e67900fa3675429351f"
        }
      }
      fetch("https://systembolagetapimanagement.azure-api.net/varugrupp", options)
      .then(response => response.json())
      .then(jsonresponse => 
        {
          this.setState(
            {
              loading : false, varugrupper : jsonresponse
            })
          })
        .catch(error => this.getVarutyper(tries + 1));
    } else {
      this.setState({error : true, loading : false})
    }    
  }
}

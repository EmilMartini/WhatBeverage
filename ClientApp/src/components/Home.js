import React, { Component } from 'react';
import {Spinner, Button, FormGroup, Input} from 'reactstrap'

export class Home extends Component {
  static displayName = Home.name;

  constructor(props){  
    super(props);  
    this.state = {  
         loading : true,
         fetching : false,
         data : [],
         error : false
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

    if(this.state.error){
      content = <div className="text-center text-white"><p>Unable to get data, try again..</p><Button onClick={() => window.location.reload()}>Try again</Button></div>
    } else if(this.state.loading){
      content = 
      <div className="text-center mx-auto mt-5 text-white">
        <h3>Getting the latest data...</h3>
        <Spinner color="success"></Spinner>
      </div>
    } else {
      content = 
      <div className="text-center mx-auto">
        <FormGroup>
          <Input type="select" id="typSelect" className="form-control mt-2">
            {this.state.data.map(typ => <option key={typ}>{typ}</option>)}
          </Input>
          <Button className="btn-success mt-2"
            onClick={
              () => this.randomizeBeverage()}>
                Slumpa</Button>
        </FormGroup>
      </div>
    }

    return (
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <h2 className="display-5 mt-5 text-white">SYSTEMETSLUMPAREN</h2>
        </div>
        {content}
      </div>
    );
  }

  randomizeBeverage(){
    let value = document.getElementById("typSelect").value;
    console.log(value);
  }

  getVarutyper(tries){
    console.log(tries);
    if(tries < 10){
      this.setState({loading:true, fetching : true});
      let options = {
        header : {
          "Ocp-Apim-Subscription-Key" : "c3f1ce433ffa4f21b52cdc89a5e99cee"
        }
      }
      fetch("https://systembolagetapimanagement.azure-api.net/varugrupp", options)
      .then(response => response.json())
      .then(jsonresponse => 
        {
          this.setState(
            {
              loading : false, data : jsonresponse
            })
          })
        .catch(error => this.getVarutyper(tries + 1));
    } else {
      this.setState({error : true, loading : false})
    }    
  }
}

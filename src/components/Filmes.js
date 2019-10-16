import React, { Component } from 'react'
import axios from 'axios'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'

class Filmes extends Component {
  constructor() {
    super();
    this.state = {
      genero: ''
    }
  }

  componentDidMount() {
    this.handleGetFilmes();
  }

  handleGetFilmes = () => {
    axios.get('http://localhost:8080/api/filmes')
      .then((res) => {
        this.setState({ filmes: res.data })
      })
  }

  handleClickMergeFilme = () => {
    axios.post('http://localhost:8080/api/filmes', this.state.filme)
      .then((res) => {
        this.handleGetFilmes()
      })
    this.setState({  selectedfilme: null, filme: null, displayFormFilme: false })
  }

  handleClickExcluirFilme = () => {
    let id = this.state.selectedfilme.id

    axios.delete(`http://localhost:8080/api/filmes/${id}`)
      .then((res) => {
        this.handleGetFilmes()
      }).catch(error => console.log(error))

    this.setState({
      selectedfilme: null,
      filme: null,
      displayFormFilme: false
    })
  }

  handleOnChangeField = (property, value) => {
    let filme = this.state.filme;
    filme[property] = typeof value === 'object' ? value.label : value;
    this.setState({ filme })
  }

  handleFilmeSelected = (e) => {
    this.ehNovoFilme = false;
    this.setState({
      displayFormFilme: true,
      filme: Object.assign({}, e.data)
    })
  }

  handleClickNovoFilme = () => {
    this.ehNovoFilme = true;
    this.setState({
      filme: { titulo: '', diretor: '', qtdCopias: '', genero: '' },
      displayFormFilme: true
    })
  }

  handleOnSelectionChange = (e) => this.setState({ selectedfilme: e.value, genero: e.value.genero })

  render() {
    let btnNovoFilme = <div className="p-clearfix" style={{ width: '100%' }}>
      <Button style={{ float: 'left' }} label="Novo Filme" icon="pi pi-plus" onClick={this.handleClickNovoFilme} />
    </div>

    let corButton = this.ehNovoFilme ? "p-button-success" : "p-button-warning"
    let actionsButtons = <div className="ui-dialog-buttonpane p-clearfix">
      <Button label="Excluir" icon="pi pi-times" onClick={this.handleClickExcluirFilme} className="p-button-danger p-button-raised p-button-rounded" />
      <Button label={this.ehNovoFilme ? "Salvar" : "Atualizar"} icon="pi pi-check" onClick={this.handleClickMergeFilme} className={`${corButton} p-button-raised p-button-rounded`} />
    </div>

    return (
      <div className='container'>
        <div className="content-section implementation">
          <DataTable
            value={this.state.filmes}
            paginator={true}
            rows={6}
            responsive={true}
            header="Filmes"
            footer={btnNovoFilme}
            selectionMode="single" selection={this.state.selectedfilme}
            onSelectionChange={this.handleOnSelectionChange}
            onRowSelect={this.handleFilmeSelected}>
            <Column field="titulo" header="Título" />
            <Column field="diretor" header="Diretor" />
            <Column field="qtdCopias" header="Número de Cópias" />
            <Column field="genero" header="Gênero" sortable={true} />
          </DataTable>

          <Dialog
            visible={this.state.displayFormFilme}
            width="300px"
            header="Filme"
            modal={true}
            footer={actionsButtons}
            onHide={() => this.setState({ displayFormFilme: false })}>
            {
              this.state.filme &&

              <div className="p-grid p-fluid">
                <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="titulo">Titulo</label></div>
                <div className="p-col-8" style={{ padding: '.5em' }}>
                  <InputText id="titulo" onChange={(e) => { this.handleOnChangeField('titulo', e.target.value) }} value={this.state.filme.titulo} name="titulo" />
                </div>

                <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="diretor">Diretor</label></div>
                <div className="p-col-8" style={{ padding: '.5em' }}>
                  <InputText id="diretor" onChange={(e) => { this.handleOnChangeField('diretor', e.target.value) }} value={this.state.filme.diretor} name="diretor" />
                </div>

                <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="qtdCopias">Número de Cópias</label></div>
                <div className="p-col-8" style={{ padding: '.5em' }}>
                  <InputText keyfilter="int" id="qtdCopias" onChange={(e) => { this.handleOnChangeField('qtdCopias', e.target.value) }} value={this.state.filme.qtdCopias} name="qtdCopias" />
                </div>

                <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="genero">Genero</label></div>
                <div className="p-col-8" style={{ padding: '.5em' }}>
                  <InputText id="genero" onChange={(e) => { this.handleOnChangeField('genero', e.target.value) }} value={this.state.filme.genero} name="genero" />
                </div>
              </div>
            }
          </Dialog>
        </div>
      </div>
    )
  }
}

export default Filmes
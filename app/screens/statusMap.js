const statusMap = {
    criado: {
        image: require('../../assets/criado.png'),
        label: '-'
      }, 
  cancelado: {
        image: require('../../assets/cancelado.png'),
        label: 'CANCELADO'
      }, 
  aceito: {
        image: require('../../assets/aceito.png'),
        label: 'ACEITO'
      }, 
  andamento: {
        image: require('../../assets/spinner.gif'),
        label: 'EM ANDAMENTO'
      }, 
  encerrado: {
        image: require('../../assets/encerrado.png'),
        label: 'ENCERRADO'
      }, 
  concluido: {
        image: require('../../assets/concluido.png'),
        label: 'CONCLUIDO'
      },   
  };
  
  export default statusMap;
  
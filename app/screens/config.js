module.exports = {
    // BASE_URL: 'http://192.168.15.9:3000',
    // BASE_URL_WS: 'http://192.168.15.9:3003',
    BASE_URL: 'https://api.meumarcar.com.br',
    BASE_URL_WS: 'https://ws.meumarcar.com.br/ws',
    _hour: value => value.split('T')[1].slice(0, 5),
    _date: value => value.split('T')[0].split('-').reverse().join('/'),
    _formatDate: date => {
        let value = date.split('T')[0] + "T00:00:00";
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date( value ))
    },
    _shortDate: value => {
        const date = new Date(value);
        const options = { day: 'numeric', month: 'short' };
        const formattedDate = date.toLocaleDateString('pt-BR', options);
        return formattedDate;
    },

    maskCpf: (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    maskCEP: (cep) => {
        return cep.replace(/(\d{5})(\d)/, '$1-$2');
    },
    maskPhone: (phone) => {
        const noMask = phone.replace(/\D/g, '');
        const { length } = noMask;
        if (length <= 11) {
          return noMask
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(length === 11 ? /(\d{5})(\d)/ : /(\d{4})(\d)/, '$1-$2');
        }
        return phone;
    },
    maskBirthday: (date) => {
        return date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
}
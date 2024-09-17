module.exports = {
    BASE_URL: 'http://192.168.15.9:3000',
    BASE_URL_WS: 'ws://192.168.15.9:3001',
    _hour: value => value.split('T')[1].slice(0, 5),
    _date: value => value.split('T')[0].split('-').reverse().join('/'),
    _formatDate: date => {
        let value = date.split('T')[0] + "T00:00:00";
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date( value ))
    },
}
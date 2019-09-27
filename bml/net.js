let answers = {};

db_add(answers,
    'Укажите имя команды, с помощью которой можно определить количество маршрутизаторов на пути от Вашего компьютера к заданному Web-сайту ?',
    'traceroute');

db_add(answers,
    'Какие действия предусмотрены протоколом ICMP при потере ICMP - пакета ?',
    'формирование нового ICMP - пакета, содержащего сообщение о потере;');

db_add(answers,
    'Какие поля входят в структуру ICMP-сообщения ?',
    ['длина сообщения', 'тип сообщения', 'контрольная сумма']);

db_add(answers,
    'Верно ли, что обработка ICMP-сообщения не входит в обязанности протоколов IP или ICMP ?',
    false);

function db_add(db, q, a) {
    let ans;
    if (a === true || a === false) ans = a;
    else if (Array.isArray(a)) ans = a.map(x => clear_text(x));
    else ans = clear_text(a);
    return db[clear_text(q)] = ans;
}

function clear_text(text) {
    return text.toLowerCase().replace(/[^а-яa-z]/g,'');
}

function input_type(type) {
    return !!document.querySelector(`.answer input[type='${type}']`);
}

function main() {
    let q_type = '';
    if (input_type('checkbox')) q_type = 'checkbox';
    else if (input_type('radio')) q_type = 'radio';
    else if (input_type('text')) q_type = 'text';
    else { console.error('dunno what type of question it is'); return; }
    console.log(`question type is ${q_type}`);

    let t = document.querySelector(".qtext");
    let q = clear_text(t.innerText);
    let opts;
    
    switch (q_type) {
        case 'text':
            document.querySelector(`.answer input[type='text']`).value = answers[q];
            break;
        case 'radio':
            opts = document.querySelectorAll(`.answer input[type='radio']`);
            opts.forEach(el => {
                let cans = clear_text(el.labels[0].innerText);
                if (answers[q] === true || answers[q] === false) {
                    if ((answers[q] && cans === 'верно') || (!answers[q] && cans === 'неверно')) {
                        el.click();
                    }
                } else {
                    if (cans.includes(answers[q])) {
                        el.click();
                    }
                }
            });
            break;
        case 'checkbox':
            opts = document.querySelectorAll(`.answer input[type='checkbox']`);
            opts.forEach(el => {
                let cans = clear_text(el.labels[0].innerText);
                for (let i = 0; i < answers[q].length; ++i) {
                    if (cans.includes(answers[q][i])) {
                        el.click();
                        break;
                    }
                }
            });
            break;
    }
}

console.log('injecting...');
main();

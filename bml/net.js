let answers = {};

//db_add(answers,
    //'Укажите имя команды, с помощью которой можно определить количество маршрутизаторов на пути от Вашего компьютера к заданному Web-сайту ?',
    //'traceroute');

//db_add(answers,
    //'Какие действия предусмотрены протоколом ICMP при потере ICMP - пакета ?',
    //'формирование нового ICMP - пакета, содержащего сообщение о потере;');

//db_add(answers,
    //'Какие поля входят в структуру ICMP-сообщения ?',
    //['длина сообщения', 'тип сообщения', 'контрольная сумма']);

//db_add(answers,
    //'Верно ли, что обработка ICMP-сообщения не входит в обязанности протоколов IP или ICMP ?',
    //false);
//TEST 1 START HERE
db_add(answers,
	'Какой протокол позволяет компьютерам автоматически получать IP-адрес ?',
	'DHCP');
	
db_add(answers,
	'Какой протокол позволяет маршрутизаторам динамически обновлять маршрутную информацию ?',
	'RIP');
	
db_add(answers,
	'Какой протокол предназначен для преобразования IP-адресов в MAC-адреса ?',
	'ARP');

db_add(answers,
	'Какое устройство называют многопортовым повторителем ?',
	'концентратор');
	
db_add(answers,
	'По какой линии происходит передача сигнала по методу "точка-точка" ?',
	'витая пара');
	
db_add(answers,
	'В какой топологии выход из строя одного узла сети не повлияет на работу сети в целом ?',
	['звезда','общая шина']);
	
db_add(answers,
	'Какие функции не может выполнять концентратор ?',
	['фильтрация сетевого трафика']);
	
db_add(answers,
	'Какие уровни модели OSI являются сетезависимыми ?',
	['физический', 'канальный', 'сетевой']);

db_add(answers,
	'Сколько хостов может иметь сеть, которая имеет значение маски <b>255.255.192.0</b> ?',
	'16384');
	
db_add(answers,
	'Какие из нижеперечисленных проблем может устранить концентратор ?',
	['большое количество узлов', 'отсутствие кабеля достаточной длины']);

db_add(answers,
	'Какую метрику использует для нахождения лучшего пути протокол RIP ?',
	'количество переходов');

db_add(answers,
	'Какие из нижеперечисленных атрибутов использует маршрутизатор для передачи пакетов по сети ?',
	['сетевой адрес', 'хост-машины']);
	
db_add(answers,
	'Как распространяются сигналы по сети с топологией "общая шина" ?',
	['сигнал всегда движется в обоих направлениях от источника']);
	
db_add(answers,
	'Что использует маршрутизатор для выбора пути следования пакета ?',
	'таблица маршрутизации');
	
db_add(answers,
	'Если сетевая часть IP-адреса отправителя и получателя не совпадают, то для отправки пакета надо использовать ...',
	'маршрутизатор');

db_add(answers,
	'Верно ли, что при увеличении длины маски сети уменьшается количество узлов этой сети ?',
	true);
//TEST 1 END HERE

//TEST 2_1 START HERE
db_add(answers,
	'Укажите основное назначение функции ExpertInfo:',
	'отображение перехваченных пакетов по группам;');
	
db_add(answers,
	'Укажите назначение функции Protocol Hierarhy:',
	'сборка статистики по протоколам;');
	
db_add(answers,
	'Укажите назначение функции Follow (TCP|UDP|SSL) Stream:',
	'сборка пакетов одной сессии;');
	
db_add(answers,
	'Укажите назначение меню Statistics-> Conversations',
	'отображение информации об участниках связи;');
	
db_add(answers,
	'Укажите назначение функции IO Graphs:',
	'позволяет построить статистический график по захваченным данным;');

db_add(answers,
	'Какие группы пакетов поддерживает функция ExpertInfo?',
	'все предложенные варианты;');
	
db_add(answers,
	'Какие из перечисленных протоколов являются служебными?',
	['ICMP', 'ARP', 'DHCP']);
	
db_add(answers,
	'Укажите назначение протокола ICMP',
	'для передачи информации об ошибках в дейтаграммах;');

db_add(answers,
	'Какие программы используют протокол ICMP?',
	['ping', 'tracert']);
	
db_add(answers,
	'Укажите назначение протокола DHCP',
	'для автоматического получения IP-адреса и других параметров;');
	
db_add(answers,
	'Укажите назначение протокола NAT',
	'для преобразования IP-адреса транзитных пакетов;');

db_add(answers,
	'Диаграмма FlowGraph ...',
	'отображает историю обмена пакетами;');

db_add(answers,
	'К какому типу относится MAC-адрес 01-80-С2-00-00-08?',
	['групповой', 'централизованный']);

db_add(answers,
	'Централизованный MAC-адрес сетевого интерфейса назначается ...',
	'производителем оборудования');
	
db_add(answers,
	'Локальный MAC-адрес сетевого интерфейса не назначается ...',
	['производителем оборудования;', 'руководителем организации;', 'пользователем компьютера;']);

db_add(answers,
	'На каком уровне модели OSI используются MAC-адреса?',
	'канальный;');

	
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

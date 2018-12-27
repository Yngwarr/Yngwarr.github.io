{
	let d = document.getElementsByName('query')[0];

let trig = [
	
`Отслеживается пополнение таблицы поставок SPJ. В случае, если в результате выполне-
ния операции вставки добавляемая поставка по величине превосходит 30% объема поставок
деталей, ранее выполненных этим же поставщиком, рейтинг поставщика в таблице S увели-
чивается на 10%.
@
Create or replace function f()returns trigger as'
declare
sum1 real;
begin
sum1 = (select sum(kol) from spj where n_post = new.n_post);
if (new.kol > (0.3*sum1))
then update s set reiting = reiting*1.1 where n_post = new.n_post;
end if;
return new;
end;
' language plpgsql;
create trigger tr
before insert on spj
for each row execute procedure f();

Тест:
INSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S3', 'P2', 'J3', 800,
'2014-01-01'), ('S4', 'P5', 'J4', 20, '2013-12-31');
Увеличится: Блейк 33
Не изменится: Кларк 20
`,
	
`Отслеживается пополнение таблицы поставок SPJ. В случае, если в результате выполне-
ния операций вставки суммарный объем вносимых поставок некоторого поставщика по ве-
личине превосходит 50% объема поставок деталей, ранее выполненных этим же поставщи-
ком, рейтинг поставщика в таблице S увеличивается на 25%.
@
Вариант 1:
Create trigger vova update of n_izd on j referencing old as original new as newv
For each row execute procedure kolotolin(newv.n_izd,original.n_izd)

Create procedure kolotilin(newv.n_izd char(5), newv.name,n_izd char(5)) returning
If((select count(n_izd) from j where n_izd=newv.n_izd)=1) then
Update spj set n_izd=newv.n_izd		Where n_izd=original.n_izd
Else Update j set n_izd=original.n_izd where  n_izd=newv.n_izd End if
End procedure

Вариант 2:
create or replace function funс_2_1() returns trigger as '
begin
create table tmp (n_post char(6), kol integer);
insert into tmp (select distinct n_post, sum(kol) from spj group by n_post);
return new;
end;
' language plpgsql;
create trigger tr2_1
before insert on spj
for each statement execute procedure func_2_1();
create or replace function funс_2_2() returns trigger as '
begin
update s set reiting = 1.25*reiting where n_post in (select n_post from tmp where
1.5*kol < (select sum(kol) from spj where spj.n_post=tmp.n_post));
drop table tmp;
return new;
end;
' language plpgsql;
create trigger tr2_2
after insert on spj
for each statement execute procedure func_2_2();	

Тест:
INSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S3', 'P2', 'J3', 200,
'2014-01-01'), ('S3', 'P5', 'J4', 200, '2013-12-31'), ('S4', 'P5', 'J1', 100, '2013-
11-11'), ('S4', 'P5', 'J2', 100, '2013-11-15');
Увеличится: Блейк 38
Не изменится: Кларк 20
`,
	
`Отслеживается удаление поставок из таблицы поставок SPJ. В случае, если удаляемая по -
ставка уменьшает суммарный объем поставок некоторого поставщика более, чем на 50%,
рейтинг поставщика в таблице S уменьшается на 10%.
@
CREATE OR REPLACE function func_3() returns TRIGGER AS '
DECLARE
x real;
BEGIN
x = (SELECT sum(kol) FROM spj WHERE n_post = OLD.n_post);
IF (old.kol > x*0.5) THEN
(UPDATE s SET reiting = (0.9*reiting) WHERE n_post = OLD.n_post);
END IF;
RETURN OLD;
END;
' language plpgsql;
CREATE TRIGGER trigger_3
BEFORE DELETE ON spj FOR EACH ROW
EXECUTE PROCEDURE func_3();

Тест:
delete from spj where (n_post = 'S3' and kol = 500) or (n_post = 'S4' and n_izd =
'J3');
Уменьшился: Блейк 27
Не изменится: Кларк 20
`,

`Отслеживается удаление поставок из таблицы поставок SPJ. В случае, если в результате
выполнения операций удаления суммарный объем поставок некоторого поставщика умень-
шается более, чем на 50%, рейтинг поставщика в таблице S уменьшается на 25%.
@
create or replace function func_4_1() returns trigger as '
begin
create table tmp (n_post char(6), kol integer);
insert into tmp (select distinct n_post, sum(kol) from spj group by n_post);
return old;
end;
' language plpgsql;
create trigger tr4_1
before delete on spj
for each statement execute procedure func_4_1();
create or replace function func_4_2() returns trigger as '
begin
update s set reiting = 0.75*reiting where n_post in (select n_post from tmp where
0.5*kol > (select sum(kol) from spj where spj.n_post=tmp.n_post));
drop table tmp;
return old;
end;
' language plpgsql;
create trigger tr4_2
after DELETE on spj
for each statement execute procedure func_4_2();

Тест:
DELETE from spj where (n_post = 'S2' and n_det = 'P3') or (n_post = 'S1' and n_izd =
'J1')
Уменьшился: Джонс 8
Не изменится: Смит 20
`,

`
Отслеживается пополнение таблицы поставок SPJ. Если поставку выполняет поставщик,
отсутствующий в таблице поставщиков S, соответствующая строка с номером пост-щика до-
бавляется в таблицу S. Рейтинг поставщика задается в 50% от минимального рейтинга по-
ставщиков в таблице S, остальные атрибуты определяются как NULL. В случае
несуществующих в таблицах P, J деталей или изделий, соответствующая поставка не зано-
сится.
@
create or replace function func_5() returns trigger AS $$
declare
min_x real;
begin
if ( not exists (select n_det from p where n_det = new.n_det)) then
raise exception 'Отстутствует такая деталь!';
end if;
if ( not exists (select n_izd from j where n_izd = new.n_izd)) then
raise exception 'Отстутствует такое изделие!';
end if;
if (not exists (select n_post from s where n_post = new.n_post))
then
min_x = 0.5 * (select min(reiting) from s);
insert into s (n_post, reiting) values (new.n_post, min_x);
end if;
else
return new;
end;
$$ language plpgsql;
create trigger name5
before insert on spj for each row
execute procedure func_5();

Тест:
NSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S6', 'P1', 'J1', 800,
'2013-12-31');
S6-null-5-null
INSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S7', 'P7', 'J1', 800,
'2013-12-31');
ОШИБКА: Отстутствует такая деталь!
INSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S7', 'P1', 'J8', 800,
'2013-12-31');
ОШИБКА: Отстутствует такое изделие!
`,

`
Отслеживается удаление строк из таблицы поставщиков S. При удалении некоторого по-
ставщика егo поставки из таблицы поставок SPJ связываются с поставщиком с минималь-
ным рейтингом из того же города, если таковой имеется, в противном случае - удаляется.
@
Вариант 1:
create or replace function func_6() returns trigger as'
begin
if (not exists(select town from s where town=old.town))
then
delete from spj where n_post=old.n_post;
else
update spj set n_post = (SELECT n_post from s where town = old.town order by reiting
limit 1)
where n_post=old.n_post;
end if;
return old;
end;
' language plpgsql;
create trigger tr6
after delete on s for each row
execute procedure func_6();

Вариант 2:
Create trigger delete_s delete on s referencing old as old_st
For each row(execure procedure ud(old_st.n_post, old_st.town))
Create procedure ud(n_p char(6), gor char(15))
Define f int;
Let f=0;
If(select count(*) from s where s.town=gor)=0) then
	Delete from spj where s.n_psot=n_p
Else let f=1
Endif;
If(f=1) then update spj
	Set n_post = (select n_post from s x where 
x.reiting=(select min(reiting) from s where town=gor))
where n_post=n_p
endif
end procedure


Тест:
delete from s where n_post = 'S2' or n_post = 'S5';
поставки S2 перешли к S3
поставки S5 пропали
`,

`
Отслеживается удаление строк из таблицы деталей P. Если удаляемая деталь присутству-
ет в таблице поставок SPJ, то соответствующие строки из таблицы поставок связываются с
деталью с минимальным весом из того же города, если таковой имеется, в противном случае
- удаляется.
@
create or replace function func_7() returns trigger as'
begin
if (exists(select n_det from spj where n_det=old.n_det))
then
if (exists(select town from p where town=old.town))
then
update spj set n_det = (select n_det from p where town=old.town order by ves limit
1) where n_det=old.n_det;
else
delete from spj where n_det=old.n_det;
end if;
end if;
return old;
end;
' language plpgsql;
create trigger tr7
after delete on p for each row
execute procedure func_7();

Тест:
delete from p where n_det = 'P4' or n_det = 'P3';
P4 замена на P1
P3 удалится
`,

`
Отслеживается удаление строк из таблицы изделий J. Если удаляемое изделий присут-
ствует в таблице поставок SPJ, то соответствующие строки из таблицы поставок связывают-
ся с изделием из того же города, если таковое имеется, в противном случае - удаляется.
@
create or replace function func_8() returns trigger AS '
begin
if (exists (select n_izd from spj where n_izd = old.n_izd) )
then
if (exists(select town from j where town=old.town))
then
update spj set n_izd = (select n_izd from j where town = old.town limit 1) where
n_izd = old.n_izd;
else
delete from spj where n_izd = old.n_izd;
end if;
end if;
return old;
end;
' language plpgsql;
create trigger name8
after delete on j for each row
execute procedure func_8();

Тест:
delete from j where n_izd='J3' or n_izd='J6'
J3 замена на J4 (Афины)
J6 удалится (Осло)
`,

`
Отслеживается выполнение операции модификации поля “номер_поставщика” в таблице
поставщиков S, обеспечивая уникальность номера поставщика. В случае совпадения моди-
фицированного значения номера поставщика с другими значениями номера поставщика в
таблице S модификация строки игнорируется. При успешной модификации некоторого по-
ставщика изменения каскадируются в таблицу SPJ.
@
create or replace function func_9() returns trigger as $$
begin
if (exists(select n_post from s where n_post=new.n_post)) then
raise exception 'Такой поставщик уже есть!';
else
update spj set n_post = new.n_post where n_post=old.n_post;
end if;
return new;
end;
$$ language plpgsql;
create trigger name9
before update on s for each row
execute procedure func_9();

Тест:
update s set n_post = 'S6' where n_post = 'S3';
заменит s3 на s6
update s set n_post = 'S1' where n_post = 'S3';
ОШИБКА: Такой поставщик уже есть!
`,

`
Отслеживается выполнение операции модификации поля “номер_детали” в таблице де-
талей P, обеспечивая уникальность номера детали. В случае совпадения модифицированного
значения номера детали с другими значениями номера детали в таблице P модификация
строки игнорируется. При успешной модификации некоторой детали изменения каскадиру-
ются в таблицу SPJ.
@
create or replace function func_10() returns trigger as $$
begin
if (exists(select n_det from p where n_det=new.n_det)) then
raise exception 'Такая деталь уже есть!';
else
update spj set n_det = new.n_det where n_det=old.n_det;
end if;
return new;
end;
$$ language plpgsql;
create trigger name10
before update on p for each row
execute procedure func_10();

Тест:
update p set n_det = 'P7' where n_det = 'P5';
заменит P5 на P7
update p set n_det = 'P3' where n_det = 'P1';
ОШИБКА: Такая деталь уже есть!
`,

`
Отслеживается выполнение операции модификации поля “номер_изделия” в таблице из-
делий J, обеспечивая уникальность номера изделия. В случае совпадения модифицированно-
го значения номера изделия с другими значениями номера изделия модификация строки иг-
норируется. При успешной модификации некоторого изделия изменения каскадируются в
таблицу SPJ.
@
create or replace function func_11() returns trigger as $$
begin
if (exists(select n_izd from j where n_izd=new.n_izd)) then
raise exception 'Такое изделие уже есть!';
else
update spj set n_izd = new.n_izd where n_izd=old.n_izd;
end if;
return new;
end;
$$ language plpgsql;
create trigger name11
before update on j for each row
execute procedure func_11();

Тест:
update j set n_izd = 'J8' where n_izd = 'J2';
заменит J2 на J8
update j set n_izd = 'J1' where n_izd = 'J3';
ОШИБКА: Такое изделие уже есть!
`,

`
Отслеживается соблюдение ограничений целостности при выполнении операции моди-
фикации строк в таблице изделий SPJ, проверяя соответствие обновляемых полей номера
поставщика, номера детали и номера изделия соответствующим значениям из таблиц S, P, J.
В случае отсутствия вставляемых значений указанных полей в таблицах S, P, J модификация
игнорируется.
@
CREATE OR REPLACE FUNCTION func_12() RETURNS trigger AS $$
BEGIN
if ((not exists(select n_det FROM p WHERE n_det = NEW.n_det)) or
(not exists (select n_izd FROM j WHERE n_izd = NEW.n_izd)) or
(not exists (select n_post FROM s WHERE n_post = NEW.n_post)))
THEN
RAISE EXCEPTION 'Отсутствие детали/изделия/поставщика
в соответствующей таблице';
END IF;
RETURN NEW;
END; $$
LANGUAGE plpgsql;
CREATE TRIGGER name12
BEFORE UPDATE ON spj
FOR EACH ROW EXECUTE PROCEDURE func_12();

Тест:
update spj set n_post = 'S1', n_det = 'P1', n_izd = 'J1' where n_post = 'S3' and kol
= '500';
изменит строку : S1 / P1 / J1/ 500 2012-09-05
update spj set n_post = 'S6' where n_post = 'S2';
update spj set n_det = 'P7' where n_det = 'P2';
update spj set n_izd = 'J8' where n_izd = 'J2';
ОШИБКА: Отсутствие детали/изделия/поставщика
в соответствующей таблице
`,

`
Отслеживается выполнение операции модификации поля “город” в таблице изделий J.
Новое значение города должно быть из списка городов таблиц S, P, J. При несоблюдении ука-
занных условий модификация отвергается.
@
create or replace function func_13() returns trigger as $$
begin
if (new.town not in(select town from s) and new.town not in(select town from p) and
new.town not in(select town from j))
then
raise exception 'Город отсутствует в таблицах!';
end if;
return new;
end;
$$
language plpgsql;
create trigger name13
before update on j
for each row execute procedure func_13();

Тест:
update j set town = 'Лондон' where n_izd = 'J3';
изменит строку: J3 / Считывател / Лондон
(вместо Афин)
update j set town = 'Некрополь' where n_izd = 'J1';
ОШИБКА: Город отсутствует в таблицах!
`,

`
Отслеживается выполнение операции модификации поля “город” в таблице деталей P.
Новое значение города должно быть из списка городов таблиц S, P, J. При несоблюдении ука-
занных условий модификация отвергается.
@
create or replace function func_14() returns trigger as $$
begin
if (new.town not in(select town from s) and new.town not in(select town from p) and
new.town not in(select town from j))
then
raise exception 'Город отсутствует в таблицах!';
end if;
return new;
end;
$$
language plpgsql;
create trigger name14
before update on p
for each row execute procedure func_14();

Тест:
update p set town = 'Лондон' where n_det = 'P3';
изменит строку: P3 / Винт / Лондон /17/ Голубой
(вместо Рим)
update p set town = 'Некрополь' where n_det = 'P1';
ОШИБКА: Город отсутствует в таблицах!
`,

`
Отслеживается выполнение операции модификации поля “город” в таблице поставщи-
ков S. Новое значение города должно быть из списка городов таблиц S, P, J. При несоблюде-
нии указанных условий модификация отвергается.
@
create or replace function func_15() returns trigger as $$
begin
if (new.town not in(select town from s) and new.town not in(select town from p) and
new.town not in(select town from j))
then
raise exception 'Город отсутствует в таблицах!';
end if;
return new;
end;
$$
language plpgsql;
create trigger name15
before update on s
for each row execute procedure func_15();

Тест:
update s set town = 'Лондон' where n_post = 'S3';
изменит строку: S3/ Блейк /30 /Лондон (вместо Париж)
update s set town = 'Некрополь' where n_post = 'S1';
ОШИБКА: Город отсутствует в таблицах!
`,

`
Отслеживается модификация поля “количество” таблицы поставок SPJ. В случае, если в
результате выполнения операции модификации новое количество по величине превосходит
30% объема поставок деталей, ранее выполненных этим же поставщиком, рейтинг постав-
щика в таблице S увеличивается на 10%.
@
CREATE OR REPLACE function func_16() returns TRIGGER AS '
DECLARE
x real;
BEGIN
x = (SELECT sum(kol) FROM spj WHERE n_post = NEW.n_post);
IF (new.kol > x*0.3) THEN
UPDATE s SET reiting = 1.1*reiting WHERE n_post = NEW.n_post;
END IF;
RETURN NEW;
END;
' language plpgsql;
CREATE TRIGGER name16
BEFORE update ON spj FOR EACH ROW
EXECUTE PROCEDURE func_16();

Тест:
update spj set kol = 800 where n_post = 'S3' and kol = 200;
Увеличился: Блейк 33
update spj set kol = 300 where n_post = 'S1' and kol = 200
не изменится Смит 20
`,

`
Отслеживается модификация поля “количество” таблицы поставок SPJ. В случае, если в
результате выполнения операций модификации суммарный объем измененных полей “ко-
личество” некоторого поставщика по величине превосходит 50% объема поставок деталей,
ранее выполненных этим же поставщиком, рейтинг поставщика в таблице S увеличивается
на 25%.
@
create or replace function funс_17_1() returns trigger as '
begin
create table tmp (n_post char(6), kol integer);
insert into tmp (select distinct n_post, sum(kol) from spj group by n_post);
return new;
end;
' language plpgsql;
create trigger name17_1
before update on spj
for each statement execute procedure func_17_1();
create or replace function funс_17_2() returns trigger as '
begin
update s set reiting = 1.25*reiting where n_post in (select n_post from tmp where
1.5*kol < (select sum(kol) from spj where spj.n_post=tmp.n_post));
drop table tmp;
return new;
end;
' language plpgsql;
create trigger name17_2
after update on spj
for each statement execute procedure func_17_2();

Тест:
update spj set kol = 700 where (n_post = 'S5' and kol = 100) or (n_post = 'S2' and
kol = 500);
Увеличится: S5 Адамс 30+8
Не изменится: S2 Джонс 10+0
`,

`
Отслеживается удаление строк из таблицы деталей P. Удаление детали каскадируется в
таблицу SPJ, в которой удаляются связанные с этой деталью поставки. Для тех поставщи-
ков, для которых в результате удаления поставок суммарный объем поставок уменьшается
более чем на 50%, рейтинг поставщика в таблице S уменьшается на 25%.
@
create or replace function func_18_1() returns trigger as '
begin
create table tmp (n_post char(6), kol integer);
insert into tmp (select distinct n_post, sum(kol) from spj group by n_post);
return old;
end;
' language plpgsql;
create trigger name18_1
before delete on p for each statement
execute procedure func_18_1();
create or replace function func_ 18_2() returns trigger as '
begin
update s set reiting = 0.75*reiting where n_post in (select distinct n_post from tmp
where 0.5*kol > (select sum(kol) from spj where spj.n_post=tmp.n_post));
drop table tmp;
return old;
end;
' language plpgsql;
create trigger name18_2
after delete on p for each statement
execute procedure func_ 18_2();
create or replace function func_ 18_3() returns trigger as '
begin
delete from spj where n_det = old.n_det;
return old;
end;
' language plpgsql;
create trigger name18_3
after delete on p for each row
execute procedure func_ 18_3();

Тест:
delete from p where n_det = 'P3' or n_det = 'P2';
Уменьшился: Джонс 8 (из-за P3)
`,

`
Отслеживается удаление строк из таблицы изделий J. Удаление изделия каскадируется в
таблицу SPJ, в которой удаляются связанные с этим изделием поставки. Для тех поставщи-
ков, для которых в результате удаления поставок суммарный объем поставок уменьшается
более, чем на 50%, рейтинг поставщика в таблице S уменьшается на 25%.
@
create or replace function func_19_1() returns trigger as '
begin
create table tmp (n_post char(6), kol integer);
insert into tmp (select distinct n_post, sum(kol) from spj group by n_post);
return old;
end;
' language plpgsql;
create trigger name19_1
before delete on j for each statement
execute procedure func_19_1();
create or replace function func_ 19_2() returns trigger as '
begin
update s set reiting = 0.75*reiting where n_post in (select distinct n_post from tmp
where 0.5*kol > (select sum(kol) from spj where spj.n_post=tmp.n_post));
drop table tmp;
return old;
end;
' language plpgsql;
create trigger name19_2
after delete on j for each statement
execute procedure func_ 19_2();
create or replace function func_ 19_3() returns trigger as '
begin
delete from spj where n_izd = old.n_izd;
return old;
end;
' language plpgsql;
create trigger name19_3
after delete on j for each row
execute procedure func_ 19_3();

Тест:
delete from j where n_izd = 'J4' or n_izd = 'J1';
Уменьшился: S5 Адамс 30-7 8 (из-за J4)
`,

`
Отслеживается соблюдение ограничений целостности при выполнении операции добав-
ления строк в таблицу поставок SPJ. В случае отсутствия номеров поставщика, детали и из-
делия в соответствующих таблицах S, P, J, в эти таблицы добавляются строки с отсутствую-
щими в них номерами поставщика, детали и изделия с NULL-значениями остальных полей
@
CREATE OR REPLACE FUNCTION func_20() RETURNS trigger AS '
BEGIN
if (not exists(select n_det FROM p WHERE n_det = NEW.n_det)) THEN
INSERT INTO p (n_det) VALUES (NEW.n_det);
END IF;
if (not exists (select n_izd FROM j WHERE n_izd = NEW.n_izd)) THEN
INSERT INTO j (n_izd) VALUES (NEW.n_izd);
END IF;
if (not exists (select n_post FROM s WHERE n_post = NEW.n_post)) THEN
INSERT INTO s (n_post) VALUES (NEW.n_post);
END IF;
RETURN NEW;
END; '
LANGUAGE plpgsql;
CREATE TRIGGER name20
BEFORE INSERT ON spj FOR EACH
ROW EXECUTE PROCEDURE func_20();

Тест:
INSERT INTO spj (n_post, n_det, n_izd, kol, date) VALUES ('S1', 'P1', 'J1', 100,
'2014-01-01'), ('S6', 'P2', 'J2', 200, '2013-12-31'), ('S3', 'P7', 'J3', 300, '2013-
11-11'), ('S4', 'P4', 'J8', 400, '2013-11-15'), ('S7', 'P8', 'J9', 700, '2013-11-
16');
1-все присутствует
2-4 добавляют по очереди в каждую
5-во все сразу
`,

`
Отслеживается модификация в таблице р поля номер детали. Если в таблице Р номер измененной детали совпадает хотя бы с одним существующим номером детали, 
то модификация отменяется, в противном случае производится каскадная модификация поля номер детали в spj.
@
Create trigger test
update on p referencing old as prev
			new as next
			for each row
			executeprocedure A(prev.n_det,next.n_det)
create procedure A(p,n)
define char p,n,s
select n_det into s from p x,p y            
		where x.n_det=y.n_det   and x.rowid!=y.rowid
if s==null   	update spj
		set n_det = n
		where n_det = p
else
	update p  		set n_det=p
		where n_det = n
endif
end procedure

`,

`
Отслеживать обновления поля n_post таблицы S. Обеспечить его уникальность: 
-	если обновленное значение нарушает уникальность – модификация игнорируется
-	если не нарушает, то продолжается каскадное обновление таблицы spj
@
create trigger nomer_upd
update of n_post on s
referencing new as new1
		old as old1
for each row
begin
	declare c smallint;
	select count(*) into c from s
		where s.n_post=new1.n_post
	if c>1
		update s set n_post=old1.n_post
			where s.rowid=new1.rowid
	else
		update spj set n_post = new1.n_post
			where spj.n_post = old1.n_post
	endif
end 
`,

`
При удалении поставки, если объем поставок поставщика умен-ся на 90%, то рейтинг уменьшается на 10%.
@
Create trigger tr delete on spj
Referencing old as A
	Execute procedure ppp(A.n_post,A.kol)
Create procedure ppp(npost char(6),kolvo int)
define s1 int;
Let s1 = (select sum(kol) from spj where n_post = npost);
If kolvo>s1 then
	Update s Set reiting = 0.9*reiting WHERE 
N_post = npost;
Endif
End procedure
`,

`
Отслеживается удаление строк из таблицы деталей р. Если удаляемая деталь присутствует в таблице поставок spj, то соответствующие строки из таблицы поставок связываются с деталью с минимальным весом из того же города, в противном случае деталь удаляется.
@
Create trigger del_on_p
Delete on p
Referencing old as old_st
For each row
(execute procedure u (old_st.n_det,old_st.town))
Create procedure u (n_d char(6), gor char(15))
Define flag, flag1 int;
Define det1 char(6);
Let flag = 0; let flag1=0;
If(select count(*) from p where p.town=gor)<=1
Then delete from spj where p_n_det=n_d
Else let flag1=1
Endif;
If(flag1=1) then update spj
	Set n_det=(select n_det from p x where x.ves=(select min(ves) from p where town=gor)
		Where n_det=n_d endif
End procedure
`,

`
Вводится новая поставка. Если не было поставки, то ищем минимальный рейтинг => если рейтинг=50%. Если этот номер поставки для детали для суд(?) , смотрим, если таких деталей нет, то поставка не добавляется.
@
Create trigger ON_INSERT_SPJ 
insert on spj 
Referencing new as _ins for each row
Execute procedure _insert
(_ins.n_det, _ins. _n_post, _ins._n_izd, _ins._kol)
Create procedure _insert(_ndet,_n_post,_n_izd,_kol)
Define reiting integer;
If ((select n_post from s where n_post=_n_post) is NULL)
Then
	Let reiting=0.5*(select min(reiting) from s);
	Insert into s(n_post,reiting) values (_n_post,_reiting);
Endif
If((select n_det from p where n_det=_n_det) is NULL or (select n_izd
from j where n_izd=_n_izd) is NULL)
then
	delete from spj
		where n_det=_n_det and n_psot=_n_post and n_izd=_n_izd
			and kol=_kol
	delete from S where n_post = n_post
endif
end procedure
`,

`
Активизируется при вставке в spj новой поставки. При этом:
1)	вставка не происходит, если нет детали или изделия указанного в поставке в таблицах p и j. 
2)	Если информация есть, то если нет поставщика в S, вставляем в S указанного поставщика с рейтингом = 50% от мин-о со значением null в остальных полях
Решить задачу с использованием триггеров и процедур.
@
Create trigger add_in_spj
insert on spj referencing new as new_str
For each row 
(execute procedure1(new_str.n_post,...);
Execute procedure2(...))

Create procedure1(n_postav char(6),n_detail char(6),n_izdel char(6))
Define minimum int;
Select min(reiting) into minimum from s;
Let minimum=minimum/2;
If(select count(*) from p where p.n_det=n_detail)=0 then
Elif(select count(*) from j where n_izd=n_izdel)=0 then
Elif(select count(*) from s where n_psot=n_postav)=0 then
	Insert into s values(n_postav,null,minimum,null)
Endif
End procedure

Create procedure procedure2(n_detail char(6)
If (select count(*) from p where p.n_det=n_detail)=0) then
	Delete from spj where n_det=n_detail
Elif(select count(*) from j where n_izd=n_izdel)=0)
	Delete from spj where n_izd=n_izdel
Endif    End procedure
`,

`
Отслеживается соблюдение ограничений целостности при выполнении операции модификации строк в таблице изделий spj, проверяя соответствие обновляемых полей номера поставщика, 
номера детали и номера изделия соответствующим значениям из таблиц s,p,j. В случае отсутствия вставляемых значений указанных полей в таблицах s,p,j, модификация игнорируется.
@
Select * from j where not n_izd in
	(select n_izd from spj where not n_post in
		(select n_post from s where 
reiting<(select avg(reiting) from s)))
`,

`
Выбрать (без повторов) номера поставщиков, для которых количество поставок какой-либо детали этим поставщиком = количеству изделий.
@
Create trigger reit update of kol on spj 
referencing old as orig new as upd
before(execute old_sum( ));
for each row (execute procedure on_update (upd.n_post, upd.kol, orig.kol)
after (execute reit_raise( ));
create procedure oldsum()
create table tmp(n_post char(5),new_kol smallint, old_kol smallint)
insert into temp select distinct n_post,sum(kol) 
from spj group by n_post;
end procedure
create procedure on_update(num_post char(5), new_k int)
update tmp set new_kol_new_kol+new_k where n_post = num_post
end procedure
create procedure reit_raise()
define new_k smallint;
define old_k smallint;
foreach select new_kol,old_kol into new_k,old_k from tmp;
	if(new_k>0.5*old_k) then
		update s set reiting=1.25*reiting;
	else
		continue
	endif;
end foreach;
drop table tmp;
end procedure
`,

`
Отследить выполнение операции модификации поля «город» в таблице р. Новое значение города должно быть из списка городов таблиц s,p,j. При несоблюдении указанных условий, модификация отвергается.
@
Create trigger H update of town оn p referencing old as original referencing new as copy
For each row(when(select count(*) from s,copy where s.town = copy.town=0) and (select  count(*) from p,copy where p.town = copy.town = 0) and (select  count(*) from j,copy where j.town = copy.town = 0)
(insert into p,original values(original.n_det,original.town)
`,

`
выбрать номера изделий, чтобы в spj не содержалось таких строк, соответствующих этому изделию, что поставщик не равен S2.
Выбрать номера изделий для которых все детали поставляет только поставщик s2.
@
Select n_izd from j jx where not exists
	(select * from spj, spjy where spjy.n_izd=jx.n_izd) 
and spjy.n_post!=”S2”)
`,

`
Отслеживать выполнение операции модификации в j. Новое значение добавляется из списка городов таблиц s,p,j, иначе модификация отвергается. Выполнить задачу с использованием триггеров и процедур.
@
Create trigger test update of town on j 
referencing old as town1 new as town2
For each row when(town2.town not in (select distinct town from s) and town2.town not in (select distinct town from p) and town2.town not in (select distinct town from j))
Update j set town=town1.town where town=town2.town
Execute procedure user_msg(town2.town)
Create procedure user_msg(t char(15))
Printf(“Sorry, there is no information about town %s in database”,t);
End procedure
`,

`
Отслеживается изменение индекса изделия в табл. изделий если изделие с таким индексом не сущ-т, то изменение каскадируются на таблицу поставок, если изделие сущ-ет, то операция отвергается.
@
Create trigger name_tr update on j
Referencing old as old_zn new as new_zn
For each row 
execute procedure name_proc(old_zn.rowid,old_zn.izd_n,new_zn.izd_n)
create procedure name_proc(int r_id,int old_id,int new_id)
define cnt integer;
let cnt=(select count(*) from j where izd.n=new_id)
if cnt!=1 then update j set izd_n=old_id where rowid=r_id
else update spj set izd_n=new_id where izd.n=old_id
end if; 
end procedure
`,

`
Триггер и процедура, которая автоматически меняет статус преподавателя, при защите кандидатской диссертации, внося преподавателя в список кандидатов.
@
CREATE FUNCTION kandidat_new() returns trigger as $kandidat_new$
DECLARE
result int;
Begin
result := (select count(*) from kandidat x where x.kod_p=NEW.kod_p);
if (result = 0) then
insert into kandidat select NEW.kod_p,NEW.kod_k;
return new;
end if;
return NULL;
end;
$kandidat_new$ LANGUAGE plpgsql;

CREATE TRIGGER kandidate_new after INSERT ON kand
FOR EACH ROW EXECUTE PROCEDURE kandidat_new();
`,

`
Триггер и процедура, которая автоматически меняет статус преподавателя, при защите докторской диссертации, с кандидата наук на доктора наук.
@
CREATE FUNCTION doctor_new() returns trigger as $doctor_new$
DECLARE
result int;
Begin
result := (select count(*) from doctor x where x.kod_p=NEW.kod_p);
if (result = 0) then
insert into doctor select NEW.kod_p,NEW.kod_d;
delete from kandidat where kod_p=New.kod_p;
return new;
end if;
return NULL;
end;
$doctor_new$ LANGUAGE plpgsql;

CREATE TRIGGER doctor_new after INSERT ON doct
FOR EACH ROW EXECUTE PROCEDURE doctor_new(); 
`

];
let sel = document.getElementsByName('server')[0];
for(let i = 0; i < trig.length; i++) {
	let t = document.createElement('option');
	t.value = i;
	t.innerHTML = trig[i].split('@')[0];
	sel.appendChild(t);
}

sel.style = 'width: 250px';

sel.onchange = () => {
	d.value = trig[sel.value];
};
		
	d.onkeypress = (e) => {
		console.log(e);
		if (e.key == '`' || e.key == '~' || e.key == 'ё') {
			let id = Number(d.value.substr(0, d.value.length));
			console.log(id);
			d.value = trig[id];
		}
	}
}

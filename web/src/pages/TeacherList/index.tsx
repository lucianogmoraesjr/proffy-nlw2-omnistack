import PageHeader from '../../components/PageHeader';
import TeacherItem from '../../components/TeacherItem';

import './styles.css';

export default function TeacherList() {
  return (
    <div>
      <div id="teacher-list-page" className="container">
        <PageHeader title="Estes são os proffys disponíveis.">
          <form id="search-teachers">
            <div className="input-block">
              <label htmlFor="subject">Matéria</label>
              <input type="text" id="subject" />
            </div>

            <div className="input-block">
              <label htmlFor="weekday">Dia da semana</label>
              <input type="text" id="weekday" />
            </div>

            <div className="input-block">
              <label htmlFor="time">Horário</label>
              <input type="text" id="time" />
            </div>
          </form>
        </PageHeader>

        <main>
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
          <TeacherItem />
        </main>
      </div>
    </div>
  );
}
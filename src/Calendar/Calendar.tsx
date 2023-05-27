import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import 'dayjs/locale/ru'
import styles from './styles.module.scss'
import { Controls } from './components/Controls'

dayjs.locale('ru')
dayjs.extend(isToday)

/*

[ ] - начальная дата может быть одновременно и конечной?
[ ] - цифры должны становиться белыми, если мы выбираем диапазон из серых дат
[ ] - как будет выглядеть сегодняшнее число, если она попадает в диапазон

*/

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [startDay, setStartDay] = useState<any>(null)
  const [endDay, setEndDay] = useState<any>(null)
  const [isOpenCalendar, setOpenCalendar] = useState(false)

  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  const getDaysOfMonth = () => {
    const startOfWeek = currentMonth.startOf('month').startOf('week')
    let date = startOfWeek
    let days = []

    for (let i = 0; i < 42; i++) {
      days.push(date.toDate())
      date = date.add(1, 'day')
    }
    return days
  }

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const dayStyle = (currentDay: any) => {
    return classNames(styles.day, {
      [styles.day_today]: currentDay.isToday(),
      [styles.day_fromOtherMonth]: currentDay.month() !== currentMonth.month(),
      [styles.day_selected_start]: currentDay.isSame(startDay),
      [styles.day_selected_end]: currentDay.isSame(endDay),
      [styles.range]:
        (currentDay.isAfter(startDay) && currentDay.isBefore(endDay)) ||
        currentDay === startDay ||
        currentDay === endDay,
    })
  }

  const handleClickDay = (day: any) => {
    if (!startDay) {
      return setStartDay(day)
    }
    const endDayIsAfter = day.isAfter(startDay)

    if (!endDay && endDayIsAfter) {
      return setEndDay(day)
    }

    if (!endDay && !endDayIsAfter) {
      setStartDay(day)
      setEndDay(startDay)
      return
    }

    setStartDay(day)
    setEndDay(null)
  }

  return (
    <>
      <div
        className={styles.period}
        onClick={() => setOpenCalendar(!isOpenCalendar)}
      >
        Период
        {startDay && endDay && (
          <span>
            {startDay.format('DD.MM.YY')} — {endDay.format('DD.MM.YY')}
          </span>
        )}
      </div>
      {isOpenCalendar && (
        <div className={styles.wrapper}>
          <Controls
            prev={prevMonth}
            next={nextMonth}
            current={currentMonth.format('MMMM YYYY')}
          />
          <div className={styles.calendar}>
            {daysOfWeek.map((weekDay, index) => (
              <div key={index} className={styles.weekDay}>
                {weekDay}
              </div>
            ))}
            {getDaysOfMonth().map((day) => {
              const currentDay = dayjs(day)
              return (
                <div
                  key={day.toString()}
                  className={dayStyle(currentDay)}
                  onClick={() => handleClickDay(currentDay)}
                >
                  {currentDay.date()}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

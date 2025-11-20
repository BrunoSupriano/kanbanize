"use client"

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getTasks, crateTask, updateTask } from '@/api/task'
import TaskModal from '@/components/TaskModal'
import moment from 'moment'
import _ from 'lodash'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './rbc_css.css'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

export default function Calendario() {
    const [DnDCalendar, setDnDCalendar] = useState<any>(null)
    const [tasks, setTasks] = useState<any>([])
    const [modal, setModal] = useState({ toggle: false, content: {} })
    
    const localizer = useMemo(
        () =>
            dateFnsLocalizer({
                format,
                parse,
                startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
                getDay,
                locales: { 'pt-BR': ptBR },
            }),
        []
    )

    useEffect(() => {
        let mounted = true
        
        Promise.all([
            import('react-big-calendar/lib/addons/dragAndDrop'),
            import('react-big-calendar')
        ]).then(([dragDropMod, rbcMod]) => {
            if (mounted) {
                const withDragAndDrop = dragDropMod.default
                const DnD = withDragAndDrop(rbcMod.Calendar)
                setDnDCalendar(() => DnD)
            }
        })
        
        return () => {
            mounted = false
        }
    }, [])

    const getTasksContent = useCallback(async () => {
        const tasks: any = await getTasks({})
        setTasks(_.map(tasks.content, (data) => ({
            id: data.id,
            title: data.titulo,
            description: data.descricao,
            status: data.situacao,
            priority: data.prioridade,
            allDay: true,
            start: moment(data.data_vencimento).startOf('day').toDate(),
            end: moment(data.data_vencimento).endOf('day').toDate(),
        })))
    }, [])

    useEffect(() => {
        const load = async () => {
            await getTasksContent()
        }

        load()
    }, [getTasksContent])

    const handleSelectSlot = useCallback(({ start }: any) => {
        setModal({ toggle: true, content: { date: moment(start).utc().format("YYYY-MM-DD") } })
    }, [])

    const handleSelectEvent = useCallback((event: any) => {
        setModal({ toggle: true, content: event })
    }, [])

    const saveTask = useCallback(async (task: any) => {
        if (task.id) {
            await updateTask(task.id, {
                titulo: task.title,
                descricao: task.description,
                situacao: task.status,
                prioridade: task.priority,
                data_vencimento: task.date
            })
        } else {
            await crateTask({
                titulo: task.title,
                descricao: task.description,
                situacao: task.status,
                prioridade: task.priority,
                data_vencimento: task.date
            })
        }

        await getTasksContent()
    }, [getTasksContent])

    const handleEventDrop = useCallback(({ event, start, end }: any) => {
        saveTask({
            ...event,
            start,
            end,
            date: moment(start).utc().format("YYYY-MM-DD")
        })
    }, [saveTask])

    const handleEventResize = useCallback(({ event, start, end }: any) => {
        saveTask({
            ...event,
            start,
            end,
            date: moment(start).utc().format("YYYY-MM-DD")
        })
    }, [saveTask])

    if (!DnDCalendar) {
        return (
            <div style={{ 
                height: '88vh', 
                padding: '5px', 
                background: "#fff", 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #155dfc',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#333', fontSize: '16px' }}>Carregando calendário...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: '88vh', padding: '5px', background: "#fff" }}>
            {!!modal.toggle &&
                <TaskModal
                    task={modal.content}
                    onClose={() => setModal({ toggle: false, content: {} })}
                    onSave={async (task) => {
                        await saveTask(task)
                        setModal({ toggle: false, content: {} })
                    }}
                />
            }

            <DnDCalendar
                selectable
                localizer={localizer}
                events={tasks}
                startAccessor="start"
                endAccessor="end"
                culture="pt-BR"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                resizable
                draggableAccessor={() => true}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.color || '#2b7fff',
                        color: 'white',
                        borderRadius: '5px',
                        border: 'none',
                        display: 'block',
                    }
                })}
                style={{ height: '100%', color: "#333" }}
                messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Nenhum evento neste período.',
                }}
            />
        </div>
    )
}
"use client"

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getTasks, crateTask, updateTask } from '@/api/task'
import TaskModal from '@/components/TaskModal'
import Header from '@/components/Header'
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
            date: data.data_vencimento,
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

    const normalizePriority = (p: string) => 
    p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


    const saveTask = useCallback(async (task: any) => {
        try {

            const mapStatus = {
            "todo": "pendente",
            "in-progress": "andamento",
            "done": "concluido"
            }

            const payload: any = {
            title: task.title,
            description: task.description || "-",
            date: moment(task.date).toISOString(),
            status: mapStatus[task.status] || "pendente",
            priority: normalizePriority(task.priority || "media")
            };

            if (task.idColumn) payload.idColumn = task.idColumn;
            if (task.idUser) payload.idUser = task.idUser;
            
            console.log('Salvando tarefa:', payload)
            
            if (task.id) {
                await updateTask(task.id, payload)
            } else {
                await crateTask(payload)
            }

            await getTasksContent()
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error)
            throw error
        }
    }, [getTasksContent])

    const handleEventDrop = useCallback(({ event, start }: any) => {
        const taskData = {
            id: event.id,
            title: event.title || 'Sem título',
            description: event.description || '',
            status: event.status || 'pendente',
            priority: event.priority || 'media',
            date: moment(start).format("YYYY-MM-DD")
        }
        console.log('Arrastando tarefa:', taskData)
        saveTask(taskData)
    }, [saveTask])

    const handleEventResize = useCallback(({ event, start }: any) => {
        const taskData = {
            id: event.id,
            title: event.title || 'Sem título',
            description: event.description || '',
            status: event.status || 'pendente',
            priority: event.priority || 'media',
            date: moment(start).format("YYYY-MM-DD")
        }
        console.log('Redimensionando tarefa:', taskData)
        saveTask(taskData)
    }, [saveTask])

    const handleToggleForm = useCallback(() => {
        setModal({ toggle: true, content: { date: moment().format("YYYY-MM-DD") } })
    }, [])

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

            <Header onAddTaskClick={handleToggleForm} />

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
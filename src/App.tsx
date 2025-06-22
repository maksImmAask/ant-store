import { Button, Flex, Form, Input, List, notification, Modal } from 'antd'
import { useStore } from './store'
import Title from 'antd/es/typography/Title'
import { useState } from 'react'
const { TextArea } = Input

type FieldType = {
  title?: string
  description?: string
}

export type TodoItem = {
  id: number
  title: string
  description: string
}

function App() {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm<FieldType>()
  const { todos, add, remove, update } = useStore()
  const [api, contextHolder] = notification.useNotification()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const showDeleteModal = (id: number) => {
    setSelectedId(id)
    setModalOpen(true)
  }

  const handleOk = () => {
    if (selectedId !== null) {
      remove(selectedId)
      api.success({ message: 'Todo удалён' })
    }
    setModalOpen(false)
    setSelectedId(null)
  }

  const handleCancel = () => {
    setModalOpen(false)
    setSelectedId(null)
  }
  const showEditModal = (item: TodoItem) => {
    setSelectedId(item.id)
    editForm.setFieldsValue({ title: item.title, description: item.description })
    setEditModalOpen(true)
  }

  const handleEditOk = () => {
    editForm.validateFields().then((values) => {
      if (selectedId !== null) {
        update(selectedId, values)
        api.success({ message: 'Todo обновлён' })
      }
      setEditModalOpen(false)
      setSelectedId(null)
    })
  }

  const handleEditCancel = () => {
    setEditModalOpen(false)
    setSelectedId(null)
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{ width: '100vw', height: '100vh' }}
      vertical
      gap={20}
    >
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        style={{
          border: '2px solid grey',
          padding: '12px',
          borderRadius: '12px',
          width: '400px',
        }}
        onFinish={(e) => {
          add({ ...e, id: todos.length + 1 })
          form.resetFields()
          api.success({ message: 'Your todo success created' })
        }}
      >
        <Form.Item<FieldType>
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input title!' }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <TextArea allowClear />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <List
        size="small"
        header={<div>Todos</div>}
        footer={null}
        bordered
        dataSource={todos}
        style={{ width: '400px' }}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Flex gap={10} align="center" style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                {item.id + 1}
              </Title>
              -{' '}
              <Title level={4} style={{ margin: 0 }}>
                {item.title}
              </Title>
              <Flex gap={10} style={{ marginLeft: 'auto' }}>
                <Button onClick={() => showEditModal(item)}>Update</Button>
                <Button
                  danger
                  onClick={() => showDeleteModal(item.id)}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          </List.Item>
        )}
      />
      <Modal
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Удалить"
        cancelText="Отмена"
        title="Подтвердите удаление"
      >
        <p>Вы уверены, что хотите удалить этот todo?</p>
      </Modal>
      <Modal
        open={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Сохранить"
        cancelText="Отмена"
        title="Редактировать todo"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item<FieldType>
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item<FieldType>
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}

export default App
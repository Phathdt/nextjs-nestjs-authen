import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (body) => {
    try {
      await axios.post('/api/auth/signin', body)

      toast.success('login success')
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message[0])
      }
    }
  }

  const fetchTask = async () => {
    try {
      const { data } = await axios.get('/api/tasks')

      toast.success('success')
      console.log(data)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next App</title>
        <meta name="description" content="Next App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="test" {...register('username')} />

        {/* include validation with required or other standard HTML validation rules */}
        <input type="password" {...register('password', { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" />
      </form>

      <button onClick={() => fetchTask()}>Click me</button>
    </div>
  )
}

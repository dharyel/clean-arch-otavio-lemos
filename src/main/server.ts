import 'module-alias/register'
import app from '@/main/config/app'

app.listen(5000, () => {
    console.log('Rerver running at http://localhost:5000')
})

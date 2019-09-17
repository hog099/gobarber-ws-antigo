import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {

    async store(req, res){

        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if(!(await schema.isValid(req.body)) ){
            return res.status(400).json({error: 'Validação de Agendamento Falhou'});
        }

        const {provider_id, date} = req.body;

        // CHECK se provider_id e um prestador de servico
        const checkIsProvider = await User.findOne({ where: {id: provider_id, provider: true} });
    
        if(!checkIsProvider ){
            return res.status(401).json({error: 'Você não pode criar um Agendamento como Prestador'});
        }
        
        // console.log(req.userId, req.body.provider_id, date);

        const user_id = req.userId; // Capta o ID do usuario logado, pegar do mniddleware auth
        const appointment  = await Appointment.create({
            user_id: user_id,
            provider_id: provider_id,
            date
        });
        
        return res.json(appointment);
    }


}

export default new AppointmentController();
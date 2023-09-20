import express from "express";
import * as contactSchemas from "../../models/Contact.js";
// import contactSchema from "../../schemas/contact-schemas.js"
import { validateBodyWrapper } from "../../decorators/index.js"
import contactController from "../../controlers/contacts-controller.js"
import { isValidId, authenticate} from "../../middlewarws/index.js"

const router = express.Router();

router.use(authenticate);


const contactValidate = validateBodyWrapper(contactSchemas.addContactSchema);
const contactUpdateFavoriteSchema = validateBodyWrapper(contactSchemas.contactUpdateFavoriteSchema);



router.get('/', contactController.getAll);


router.get('/:contactId', isValidId, contactController.getById);


router.post('/',  contactValidate, contactController.add);


router.delete('/:contactId', isValidId,  contactController.deleteById);


router.put('/:contactId', isValidId, contactValidate, contactController.updateById);

router.patch('/:contactId/favorite', isValidId, contactUpdateFavoriteSchema, contactController.updateById);


export default router;




// router.delete('/:contactId', async (req, res, next) => {
//   // try {
//     // const contactId = req.params.contactId;
//     // const result = await contacts.removeContact(contactId);

//     // if (!result) {
//     //   throw HttpError(400, "Not found");
//     // }

//     // res.status(200).json({
//     //   message: "contact deleted"
//     // })
//   // } catch (error) {

//   //   next(error)
//   // }
// })

// router.put('/:contactId', async (req, res, next) => {
//   // try {
//     // const body = req.body
//     // const contactId = req.params.contactId;
//     // // const { error } = addSchema.validate(body);

//     // // if (error) {
//     // //   throw HttpError(400, error.message);
//     // // }

//     // const result = await contacts.updateContact(contactId, body);

//     // if (!result) {
//     //   throw HttpError(400, "Not found");
//     // }
//     // res.status(200).json(result);

//   // } catch (error) {
//   //   next(error)
//   // }
// })



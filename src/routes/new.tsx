import { ActionFunction, Form, redirect, useNavigate } from "react-router-dom";
import { createContact } from "../contacts";

// eslint-disable-next-line react-refresh/only-export-components
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactInfo = Object.fromEntries(formData);
  const contact = await createContact(contactInfo);

  return redirect(`/contacts/${contact.id}`);
};

export default function NewContact() {
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input type="text" name="twitter" placeholder="@jack" />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}

import { useState } from "react";
import Modal from "../commpoents/Modal.jsx";

/* "Security check: Delete account" dialog */
export default function ConfirmDeletion({ onCancel, onConfirm }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  return (
    <Modal onClose={onCancel}>
      <h3 className="danger-title"><span className="warn-dot">!</span> Security Check: Delete Account</h3>
      <p>For your security, please enter your current aktiv account password to confirm you wish to permanently delete your account. This action cannot be undone and all your data will be erased.</p>
      <div className="input-wrap">
        <input type={show ? "text" : "password"} placeholder="Confirm Password" value={pw}
          onChange={(e) => setPw(e.target.value)} aria-label="Confirm password" />
        <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show password">👁</button>
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline btn-xs" onClick={onCancel}>Cancel</button>
        <button className="btn btn-red btn-xs" disabled={!pw} onClick={() => onConfirm(pw)}>Confirm Deletion</button>
      </div>
    </Modal>
  );
}

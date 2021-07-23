import React from "react";
import parse from "html-react-parser";

function Mailer() {
  var [mail_id, setMailid] = React.useState("");
  var [mails, setMails] = React.useState();

  var [jsx_list, setJsxlist] = React.useState([]);
  var list_of_mails = [];
  function mailsGetter() {
    var email_split = "";
    var id, i, j, exists;
    email_split = mail_id.split("@");
    fetch(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${email_split[0]}&domain=${email_split[1]}`
    )
      .then((response) => response.json())
      .then((data) => {
        for (i = 0; i < data.length; i++) {
          id = data[i].id;
          exists = 0;
          for (j = 0; j < list_of_mails.length; j++) {
            if (list_of_mails[j].id === id) {
              exists = 1;
            }
          }
          if (exists === 0) {
            fetch(
              `https://www.1secmail.com/api/v1/?action=readMessage&login=${email_split[0]}&domain=${email_split[1]}&id=${id}`
            )
              .then((response) => response.json())
              .then((data) => {
                list_of_mails.push(data);
              })
              .catch((err) => console.log("Request Failed", err));
            setMails(list_of_mails);
          }
        }
        console.log("outside loop");

        for (var k = 0; k < mails.length; k++) {
          console.log("inside loop");
          var exists2 = 0;
          for (var l = 0; l < jsx_list.length; l++) {
            if (mails[k].id === jsx_list[l].id) {
              exists2 = 1;
            }
          }
          if (exists2 === 0) {
            setJsxlist([...jsx_list, mails[k]]);
          }
        }
      })
      .catch((err) => console.log("Request Failed", err));
    console.log("jsxlist", jsx_list);
  }

  function mail_idgetter() {
    list_of_mails = [];
    var email_split = "";
    fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
      .then((response) => response.json())
      .then((data) => {
        setMailid(data[0]);
      })
      .catch((err) => console.log("Request Failed", err));
  }
  return (
    <div>
      <form>
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            Mail id
          </span>
          <input type="text" className="form-control" value={mail_id} />
        </div>
      </form>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            mail_idgetter();
          }}
        >
          Get mailid
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            mailsGetter();
          }}
        >
          Get mails
        </button>
      </div>
      <div className="row">
        {jsx_list.map((mail) => {
          var str = mail.htmlBody;
          console.log(mail.id);
          return (
            <div className="col-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{mail.from}</h5>
                  <p class="card-text">{mail.subject}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={"#id" + String(mail.id)}
                  >
                    Open mail
                  </button>
                </div>
              </div>
              <div
                class="modal fade "
                id={"id" + String(mail.id)}
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg  ">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        {mail.subject}
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      {parse(String(str), { trim: true })}
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Mailer;

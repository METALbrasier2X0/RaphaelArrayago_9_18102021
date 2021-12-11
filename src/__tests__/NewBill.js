import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"
import { ROUTES } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I submit a new bill", () => {
    test("Then I go back to Bills Page", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname }) }
      const containerNewBill = new NewBill({document, onNavigate, firestore:null, localStorage: window.localStorage })

      const handleSubmit = jest.fn(containerNewBill.handleSubmit)
      containerNewBill.fileName = "fileName.jpg"

      const formNewBill = screen.getByTestId("form-new-bill")
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy()
    })
  })



  describe("When I am on NewBill Page and I try to upload a file with an extension different from .jpg, .jpeg or .png", () => {
    test("Then I should see an alert message", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname }) }

      const containerNewBill = new NewBill({document, onNavigate, firestore:null, localStorage: window.localStorage })
      const handleChangeFile = jest.fn(containerNewBill.handleChangeFile)


      const uploadFileButton = screen.getByTestId("file")
      uploadFileButton.addEventListener("change", handleChangeFile)
      fireEvent.change(uploadFileButton, {
        target: {
          files: [new File(["CONTENT"], "demo.txt", {type: "text/plain;charset=utf-8"})]
        }
      })
        expect(window.alert).toBeCalled()
        expect(uploadFileButton.validationMessage).toBe('Fichié non supporté')
    })
    test("Then I shouldn't be able to submit the form", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname }) }
      const containerNewBill = new NewBill({document, onNavigate, firestore:null, localStorage: window.localStorage })

      const handleSubmit = jest.fn(containerNewBill.handleSubmit)

      const formNewBill = screen.getByTestId("form-new-bill")
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)

      expect(containerNewBill.fileName).toBe(null)
    }) 
  })



  describe("When I am on NewBill Page and I try to upload a file with an extension equal to .jpg, .jpeg or .png", () => {
    test("Then it upload the file", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname }) }

      const containerNewBill = new NewBill({document, onNavigate, firestore:null, localStorage: window.localStorage })
      const handleChangeFile = jest.fn(containerNewBill.handleChangeFile)

      const uploadFileButton = screen.getByTestId("file")
      uploadFileButton.addEventListener("change", handleChangeFile)
      fireEvent.change(uploadFileButton, {
        target: {
          files: [new File(["document.png"], "document.png", {type: "application/png"})]
        }
      })

      expect(handleChangeFile).toHaveBeenCalled()
      expect(uploadFileButton.files[0].name).toBe("document.png");
    })
  })
})
import { DropdownButton, Dropdown, Button } from "react-bootstrap";
import { LanguageList } from "../utils/constanst.ts";

const LanguageDropdown = ({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (lang: string) => void;
}) => {
  return (
    <DropdownButton variant="secondary" title={language}>
      {LanguageList.map((lang, index) => (
        <Dropdown.Item
          className="d-flex justify-content-between px-3 py-2"
          key={index}
          onClick={() => {
            setLanguage(lang);
          }}
        >
          <div>{lang}</div>
          <span>
            {language === lang ? (
              <img src="/done.svg" width="30" height="24" alt="done" />
            ) : null}
          </span>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default LanguageDropdown;

import { DropdownButton, Dropdown, Button } from "react-bootstrap";
import { LanguageList } from "../../utils/constanst.ts";

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
          key={index}
          onClick={() => {
            setLanguage(lang);
          }}
        >
          <div className="d-flex justify-content-between">
            <Button variant="white">{lang}</Button>
            <span className="ms-4">
              {language === lang ? (
                <img src="/done.svg" width="30" height="24" alt="done" />
              ) : null}
            </span>
          </div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default LanguageDropdown;

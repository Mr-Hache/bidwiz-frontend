"use client";

import React, { useState, ChangeEvent } from "react";
import { useAppDispatch } from "@/app/redux/hooks";
import { setLanguages, setSubjects } from "@/app/redux/services/filtersSlice";
import { useAppSelector } from "@/app/redux/hooks";
import { useEffect } from "react";
import style from "./filterBar.module.scss"


const languagesList = [
  "Chinese",
  "English",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Portuguese",
  "Russian",
  "Spanish",
]
const subjectsList = [
  "Accounting",
  "Biology",
  "Business Administration",
  "Chemistry",
  "Computer Science",
  "Economics",
  "Law",
  "Mathematics",
  "Music Theory",
  "Physics",
  "Political Science",
  "Programming",
]

function FilterBar() {
  const dispatch = useAppDispatch();
  const languages: string[] = useAppSelector(
    (state) => state.filters.languages
  );
  const subjects: string[] = useAppSelector((state) => state.filters.subjects);

  const [stateLanguagesCheckbox, setStateLanguagesCheckbox] = useState(
    languagesList.map((language) => ({
      name: language,
      checked: languages.includes(language) ? true : false,
    }))
  );

  const [stateSubjectsCheckbox, setStateSubjectsCheckbox] = useState(
    subjectsList.map((subject) => ({
      name: subject,
      checked: subjects.includes(subject) ? true : false,
    }))
  );

  const handleLanguageCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedLanguagesCheckbox = [...stateLanguagesCheckbox];
    updatedLanguagesCheckbox[index].checked = event.target.checked;
    setStateLanguagesCheckbox(updatedLanguagesCheckbox);

    const selectedLanguages = updatedLanguagesCheckbox
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.name);
    dispatch(setLanguages(selectedLanguages));
  };

  const handleSubjectCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSubjectsCheckbox = [...stateSubjectsCheckbox];
    updatedSubjectsCheckbox[index].checked = event.target.checked;
    setStateSubjectsCheckbox(updatedSubjectsCheckbox);

    const selectedSubjects = updatedSubjectsCheckbox
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.name);
    dispatch(setSubjects(selectedSubjects));
  };

  useEffect(() => {
    if (languages.length == 1) {
      for (let j = 0; j < stateLanguagesCheckbox.length; j++) {
        if (languages[0] == stateLanguagesCheckbox[j].name) {
          stateLanguagesCheckbox[j].checked = true;
        } else {
          stateLanguagesCheckbox[j].checked = false;
        }
      }
    } else if (languages.length == 0) {
      for (let j = 0; j < stateLanguagesCheckbox.length; j++) {
        {
          stateLanguagesCheckbox[j].checked = false;
        }
      }
    }
    if (subjects.length == 1) {
      for (let j = 0; j < stateSubjectsCheckbox.length; j++) {
        if (subjects[0] == stateSubjectsCheckbox[j].name) {
          stateSubjectsCheckbox[j].checked = true;
        } else {
          stateSubjectsCheckbox[j].checked = false;
        }
      }
    } else if (subjects.length == 0) {
      for (let j = 0; j < stateSubjectsCheckbox.length; j++) {
        {
          stateSubjectsCheckbox[j].checked = false;
        }
      }
    }
  }, [languages, subjects]);

  return (
    <aside className={style.contAside}>
      <h2>Languages</h2>
      {stateLanguagesCheckbox.map((language, index) => (
        <div key={index} className={style.filter}>
          <label>
            <input
              type="checkbox"
              name="language"
              value={language.name}
              checked={language.checked}
              className={style.checkbox}
              onChange={(event) => handleLanguageCheckboxChange(event, index)}
            />
            {language.name}
          </label>
        </div>
      ))}
      <hr />

      <h2>Subjects</h2>
      {stateSubjectsCheckbox.map((subject, index) => (
        <div key={index} className={style.filter}>
          <label>
            <input
              type="checkbox"
              name="subject"
              value={subject.name}
              checked={subject.checked}
              className={style.checkbox}
              onChange={(event) => handleSubjectCheckboxChange(event, index)}
            />
            {subject.name}
          </label>
        </div>
      ))}
    </aside>
  );
}

export default FilterBar;
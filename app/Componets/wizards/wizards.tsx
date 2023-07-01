"use client";
import { User } from "../../redux/services/userApi";
import Wizard from "../wizard/wizard";
import Paginator from "../paginator/paginator";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";

import { setWizards } from "@/app/redux/services/wizardsSlice";
import {
  setLanguages,
  setSubjects,
  setPage,
} from "@/app/redux/services/filtersSlice";
import { useEffect, useState } from "react";
import FilterBar from "../filterBar/filterBar";


import style from "./wizards.module.scss"


export default function wizards() {
  const size = 9;
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.filters.page);
  const wizards = useAppSelector((state) => state.wizards.wizards);
  const languages: string[] = useAppSelector(
    (state) => state.filters.languages
  );
  const subjects: string[] = useAppSelector((state) => state.filters.subjects);
  const [statePage, setStatePage] = useState(true);
  const [totalWizards, setTotalWizards] = useState(0);

  const concatLanguagesAndSubjects = (
    languages: string[] = [],
    subjects: string[] = []
  ) => {
    const stringLanguages =
      languages.length > 0
        ? `languages=${languages.join("&languages=")}`
        : null;
    const stringSubjects =
      subjects.length > 0 ? `subjects=${subjects.join("&subjects=")}` : null;
    const filter =
      stringLanguages && stringSubjects
        ? `${stringLanguages}&${stringSubjects}`
        : stringLanguages
        ? stringLanguages
        : stringSubjects
        ? stringSubjects
        : null;
    return filter;
  };
  const takeCounter = (languages: string[] = [], subjects: string[] = []) => {
    const filter = concatLanguagesAndSubjects(languages, subjects);
    fetch(
      `https://bidwiz-backend-production-db77.up.railway.app/users/wizards/count?${filter}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("ERROR Request");
        }
        return response.json();
      })
      .then((data) => {
        setTotalWizards(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const takeWizards = (
    languages: string[] = [],
    subjects: string[] = [],
    page: number
  ) => {
    const filter = concatLanguagesAndSubjects(languages, subjects);
    fetch(
      `https://bidwiz-backend-production-db77.up.railway.app/users/wizards?page=${page}&size=${size}&${filter}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("ERROR Request");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setWizards(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    takeCounter(languages, subjects);
    takeWizards(languages, subjects, 1);
    return () => {
      dispatch(setLanguages([]));
      dispatch(setSubjects([]));
    };
  }, []);

  useEffect(() => {
    dispatch(setPage(1));
    takeCounter(languages, subjects);
    takeWizards(languages, subjects, 1);    
  }, [languages, subjects]);

  useEffect(() => {
    takeWizards(languages, subjects, page);
  }, [page]);

  useEffect(() => {
    const allowPage = Math.ceil(totalWizards / size);
    if (page == allowPage) {
      setStatePage(false);
    } else {
      setStatePage(true);
    }
  }, [page, totalWizards]);


  return (    
    <div className={style.contCard}>
      <div className={style.containerWizard}>

        <div className={style.filterBar}>
          <FilterBar />
        </div>
          <div className={style.containerCard}>
          {wizards && wizards.map((wizardUser: User) => {
            return <Wizard key={wizardUser._id} wizardUser={wizardUser} />
      })}
       {wizards && wizards.length > 0 && <Paginator statePage={statePage} />}
      </div>
      </div>             
    </div>
  );
}
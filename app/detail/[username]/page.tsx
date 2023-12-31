"use client";
import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { usePathname } from "next/navigation";
import { User, useGetUserByIdQuery } from "@/app/redux/services/userApi";
import Navbar from "@/app/Componets/navbar/navbar";
import styles from "./detail.module.scss";
import { useCreateJobMutation } from "@/app/redux/services/userApi";
import { useAppSelector } from "../../redux/hooks";
import Flag from "react-world-flags";
import { flags, subjectsIcons } from "@/app/utils/flagsAndObjectsIcons";
import {
  FaBook,
  FaMicroscope,
  FaBriefcase,
  FaVial,
  FaCode,
  FaRegChartBar,
  FaBalanceScale,
  FaCalculator,
  FaMusic,
  FaAtom,
  FaUserGraduate,
  FaLaptopCode,
} from "react-icons/fa";
import { IconType } from "react-icons";
import CalendarUpdate from "@/app/Componets/calendarUpdate/calendarUpdate";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import Loading from "@/app/Componets/Loading/Loading";
import { useTheme } from "next-themes";
import { IoIosStar } from "react-icons/io";

interface LanguageFlag {
  name: string;
  flag: string | null;
}

function detail() {
  const localUid = useAppSelector((state) => state.userAuth.uid);
  initMercadoPago("TEST-f290c78e-5208-406e-8395-17f2f78dfc23");
  const [preferenceId, setPreferenceId] = useState("");
  const [createJobDto, setCreateJobDto] = useState({});
  const [buyerId, setBuyerId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [buyerName, setBuyerName] = useState("");

  const [available, setAvailable] = useState<{ day: string; hour: string }[]>(
    []
  );
  const [createJob, { data: job }] = useCreateJobMutation();
  const pathname = usePathname();
  const _id = pathname.split("/")[2];
  const { theme } = useTheme();

  const fetchUserData = () => {
    fetch(
      `https://bid-wiz-backend.vercel.app/users/user/${localUid}`
    )
      .then((response) => response.json())
      .then((data) => {
        setBuyerId(data._id);
        setBuyerName(data.name);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetchUserData();
  }, [localUid]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleClassesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedNumber = parseInt(e.target.value);
    setSelectedClasses(selectedNumber);
    if (user) {
      switch (selectedNumber) {
        case 1:
          setSelectedPrice(user.pricePerOne);
          break;
        case 2:
          setSelectedPrice(user.pricePerTwo);
          break;
        case 3:
          setSelectedPrice(user.pricePerThree);
          break;
        default:
          setSelectedPrice(null);
      }
    }
  };

  const handleClick = async () => {
    try {
      let templateParams = {
        message: `Class: ${selectedSubject} in ${selectedLanguage}. Client name: ${buyerName}. Client ID: ${buyerId}. Wizard name: ${
          user?.name
        }. Wizard ID: ${_id}. Price: $${
          (selectedClasses || 0) * (selectedPrice || 0)
        } USD.`,
        to_email: user?.email,
      };
      const newJob = await createJob(createJobDto).unwrap();
      setPreferenceId(newJob.result);
      sendEmail(templateParams);
    } catch (error) {
      Swal.fire("Need to login or wrong select");
      console.error(error);
    }
  };

  useEffect(() => {
    setCreateJobDto({
      ...createJobDto,
      status: "In Progress",
      description: `Class: ${selectedSubject} in ${selectedLanguage}. Client name: ${buyerName}. Wizard name: ${
        user?.name
      }. Price: $${(selectedClasses || 0) * (selectedPrice || 0)} USD.`,
      price: selectedPrice,
      numClasses: selectedClasses,
      clientId: buyerId,
      workerId: _id,
      language: selectedLanguage,
      subject: selectedSubject,
      result: "default",
      availability: available,
    });
  }, [
    selectedLanguage,
    selectedSubject,
    selectedClasses,
    _id,
    selectedPrice,
    buyerId,
    available,
  ]);

  function sendEmail(templateParams: {
    message: string;
    to_email: string | undefined;
  }) {
    emailjs
      .send(
        "service_09m33gr",
        "template_plhbgod",
        templateParams,
        "UGYQRFU0vkqoRXNx0"
      )
      .then(
        (response) => {},
        (error) => {
          console.error("FAILED...", error);
        }
      );
  }

  const { data: user, isLoading, isError } = useGetUserByIdQuery({ _id });

  if (isLoading) return <Loading />;
  if (isError || !user) return <div>User not found</div>;

  const mappedLanguages: (string | null)[] = user.languages.map(
    (language: string | null) => {
      const flagObject = flags.find(
        (flag: LanguageFlag) => flag.name === language
      );
      return flagObject ? flagObject.flag : null;
    }
  );

  const getSubjectIcon = (iconName: string): IconType | null => {
    switch (iconName) {
      case "FaBook":
        return FaBook;
      case "FaMicroscope":
        return FaMicroscope;
      case "FaBriefcase":
        return FaBriefcase;
      case "FaVial":
        return FaVial;
      case "FaCode":
        return FaCode;
      case "FaRegChartBar":
        return FaRegChartBar;
      case "FaBalanceScale":
        return FaBalanceScale;
      case "FaCalculator":
        return FaCalculator;
      case "FaMusic":
        return FaMusic;
      case "FaAtom":
        return FaAtom;
      case "FaUserGraduate":
        return FaUserGraduate;
      case "FaLaptopCode":
        return FaLaptopCode;
      default:
        return null;
    }
  };

  const renderStars = (numStars: number) => {
    const stars: JSX.Element[] = [];

    for (let i = 0; i < Math.round(numStars); i++) {
      stars.push(<IoIosStar key={i} />);
    }

    return stars;
  };

  const handleSelectedTimeslots = (
    timeslots: { day: string; hour: string }[]
  ) => {
    setAvailable(timeslots);
    setCreateJobDto((prevCreateJobDto) => ({
      ...prevCreateJobDto,
      availability: timeslots,
    }));
  };

  return (
    <div>
      <Navbar />
      <div className={styles.block} />
      <div className={styles.detail}>
        <div
          className={`${styles.sidebar} ${
            theme === "dark" ? styles.sidebarDark : styles.sidebarLight
          }`}
        >
          <h2 className={styles.name}>{`${user.name} `}</h2>
          <img
            src={user.image}
            alt=""
            width={200}
            height={200}
            className={styles.imagen}
          />
          <div
            className={`${styles.secondCont} ${
              theme === "dark" ? styles.secondContDark : styles.secondContLight
            }`}
          >
            <h2>{user.experience.title}</h2>
            <p className={styles.stars}>{renderStars(user.reviews)}</p>
            <hr />

            <h3>Available Languages</h3>

            <div className={styles.flags}>
              {mappedLanguages
                .slice()
                .sort((a, b) => (a && b ? a.localeCompare(b) : 0))
                .map((language, index) => (
                  <div key={index} className={styles.language}>
                    {language && (
                      <Flag
                        height={20}
                        width={30}
                        code={language.slice(0, 2).toLowerCase()}
                      />
                    )}
                    <span>{language}</span>
                  </div>
                ))}
            </div>
            <hr />
            <h3>Available Subjects</h3>
            <div className={styles.subjects}>
              {user.subjects
                .slice()
                .sort((a, b) => a.localeCompare(b))
                .map((subject, index) => {
                  const subjectIcon = subjectsIcons.find(
                    (item) => item.name === subject
                  );
                  const Icon = subjectIcon
                    ? getSubjectIcon(subjectIcon.icon)
                    : null;

                  return (
                    <div key={index} className={styles.subject}>
                      {Icon && <Icon style={{ color: "#455a64" }} />}
                      <span className={styles.siglas}>{subject}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className={styles.righbar}>
          <br />
          <br />

          <div className={styles.contAbout}>
            <h2>About Me</h2>
            <h3>{user.aboutMe}</h3>
          </div>
          <table>
            <tbody>
              <div
                className={`${styles.contSelect} ${
                  theme === "dark"
                    ? styles.contSelectDark
                    : styles.contSelectLight
                }`}
              >
                <h4>Choose your language</h4>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className={styles.chooseLang}
                >
                  <option value="">Choose one</option>
                  {user.languages.map((language) => (
                    <option value={language}>{language}</option>
                  ))}
                </select>

                <h4>Choose your subject</h4>
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className={styles.chooseSubj}
                >
                  <option value="">Choose one</option>
                  {user.subjects.map((subject) => (
                    <option value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div
                className={`${styles.contInputs} ${
                  theme === "dark"
                    ? styles.contInputsDark
                    : styles.contInputsLight
                }`}
              >
                <hr />

                <input
                  type="radio"
                  name="classes"
                  value={1}
                  checked={selectedClasses === 1}
                  onChange={handleClassesChange}
                />
                <label htmlFor="">
                  Price per one class {user.pricePerOne} USD
                </label>
                <hr />

                <input
                  type="radio"
                  name="classes"
                  value={2}
                  checked={selectedClasses === 2}
                  onChange={handleClassesChange}
                />
                <label htmlFor="">
                  Price per two classes {user.pricePerTwo * 2} USD
                </label>

                <hr />
                <input
                  type="radio"
                  name="classes"
                  value={3}
                  checked={selectedClasses === 3}
                  onChange={handleClassesChange}
                />
                <label htmlFor="">
                  Price per three classes {user.pricePerThree * 3} USD
                </label>
                <hr />
              </div>
            </tbody>
          </table>
          {selectedClasses === null ? (
            <p>Select your classes</p>
          ) : selectedClasses === 0 ? (
            <p>Select your classes</p>
          ) : (
            <p>
              Please select {selectedClasses}{" "}
              {selectedClasses > 1 ? "classes" : "class"}
            </p>
          )}
          <CalendarUpdate
            calendarData={user.calendar}
            numberClasses={selectedClasses || 0}
            onSelectedTimeslots={handleSelectedTimeslots}
          />

          <button onClick={handleClick}>CONFIRM</button>
          <div>
            {preferenceId && (
              <Wallet initialization={{ preferenceId: preferenceId }} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.block2} />
    </div>
  );
}

export default detail;

/// <reference path="../types/index.d.ts" />

import axios, { AxiosRequestConfig } from "axios";
import * as fs from "fs";
import { JSDOM } from "jsdom";
import * as path from "path";

import CREW from "../__data__/crew.json";
const jsonPath = path.resolve(__dirname, "..", "__data__", "crew.json");

const sanitizeFilename = (filename: string) =>
  filename
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const downloadImage = async (
  imgSrc: string,
  imgPath: string,
  imgName: string,
  imgExt: string = "png"
): Promise<string | undefined> => {
  const imgDest = `${imgPath}/${imgName}.${imgExt}`;
  const dest = path.resolve(__dirname, "..", "..", "public", imgDest);
  try {
    fs.accessSync(dest, fs.constants.F_OK);
    console.log("EXISTS", dest);
    return imgDest;
  } catch (e) {
    const writer = fs.createWriteStream(dest);
    const handleError = (error: Error) => {
      console.log("ERROR", dest, error);
      try {
        fs.unlinkSync(dest);
      } catch (e) {
        console.log("ERROR", dest, e);
      }
      return undefined;
    };
    return axios({
      method: "GET",
      responseType: "stream",
      url: `https://stt.wiki${imgSrc}`
    })
      .then(async response => {
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      })
      .then(() => imgDest, handleError);
  }
};

const fetchWikiDom = async ({ url, ...config }: AxiosRequestConfig) => {
  console.log(url || "/w/index.php");
  return await axios
    .request({
      url: `https://stt.wiki${url || "/w/index.php"}`,
      ...config
    })
    .then(response => new JSDOM(response.data));
};

type CategoryCrew = string[];
const handleCategoryCrew = async (dom: JSDOM): Promise<CategoryCrew> => {
  const links = Array.from<HTMLAnchorElement>(
    dom.window.document.querySelectorAll("#mw-pages .mw-category-group li a")
  ).map(a => a.href);
  const nextPageLink = Array.from<HTMLAnchorElement>(
    dom.window.document.querySelectorAll("#mw-pages > a")
  ).find(a => a.textContent === "next page");
  return nextPageLink
    ? await fetchWikiDom({ url: nextPageLink.href })
        .then(handleCategoryCrew)
        .then(nextLinks => [...links, ...nextLinks])
    : links;
};

const getMaxCells = (from: HTMLTableCellElement): HTMLTableCellElement[] => {
  let s = [from];
  let nextCell;
  while (s[s.length - 1] && s[s.length - 1].nextElementSibling) {
    nextCell = (s[s.length - 1] &&
      s[s.length - 1].nextElementSibling) as HTMLTableCellElement;
    if (nextCell.className === "ATSLeft") {
      s = [nextCell];
    } else {
      s.push(nextCell);
    }
  }
  return s;
};

const getMaxSkills = async (dom: JSDOM): Promise<Skills> => {
  const maxLabelsCells = getMaxCells(
    dom.window.document.querySelector(
      ".wikitable tbody > tr:nth-child(3) td.ATSLeft"
    ) as HTMLTableCellElement
  );
  const labelsContent = maxLabelsCells.map(cell => {
    const anchor = cell.firstChild as HTMLAnchorElement;
    const label = anchor.getAttribute("title");
    return label && (`${label.toLowerCase()}_skill` as SkillName);
  });
  const maxSkillsCells = getMaxCells(
    dom.window.document.querySelector(
      ".wikitable tbody > tr:last-child td.ATSLeft"
    ) as HTMLTableCellElement
  );
  const skillsContent = maxSkillsCells
    .map(cell => cell.firstChild as HTMLSpanElement)
    .map(cell => {
      const tooltip = cell.querySelector(".tooltip") as HTMLSpanElement;
      cell.removeChild(tooltip);
      return cell.textContent;
    });
  return labelsContent.reduce((s, label, index) => {
    const content = skillsContent[index];
    if (label && content) {
      const match = content.match(/([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)/);
      if (match) {
        const [, core, rangeMin, rangeMax] = match;
        return {
          ...s,
          [label]: {
            core: Number(core),
            range_max: Number(rangeMax),
            range_min: Number(rangeMin)
          }
        };
      }
    }
    return s as Skills;
  }, {} as Skills);
};

const handleCrew = async (
  dom: JSDOM,
  url: string
): Promise<DataCrew | null> => {
  const heading = dom.window.document.querySelector(
    "#firstHeading"
  ) as HTMLHeadingElement;
  const img = dom.window.document.querySelector(
    ".infobox .image img"
  ) as HTMLImageElement;
  const stars = dom.window.document.querySelectorAll(
    ".infobox tbody > tr:nth-child(3) img"
  );
  const name = heading.textContent;
  const key = name && sanitizeFilename(name);

  return img && name && key
    ? {
        image: await downloadImage(img.src, "crew", key),
        key,
        max_rarity: stars.length as 1 | 2 | 3 | 4 | 5,
        max_skills: await getMaxSkills(dom),
        name,
        url
      }
    : null;
};

const fetchAllCrew = (): Promise<DataCrew[]> =>
  fetchWikiDom({ params: { title: "Category:Crew" } })
    .then(handleCategoryCrew)
    .then(async crewLinks => {
      const crew = CREW as DataCrew[];
      const missingCrew = crewLinks.filter(
        url => !crew.find(c => c.url === url)
      );
      for (const url of missingCrew) {
        const Crew = await fetchWikiDom({ url }).then(
          crewDom => crewDom && handleCrew(crewDom, url),
          error => console.log("FETCH FAILED", error)
        );
        if (Crew) {
          crew.push(Crew);
          fs.writeFile(jsonPath, JSON.stringify(crew, null, "\t"), error => {
            if (error) {
              console.log("WRITE FAILED", error);
            } else {
              console.log(Crew);
            }
          });
        }
      }
      return crew;
    });

fetchAllCrew().catch(error => console.log("SCRIPT FAILED", error));

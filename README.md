# Lagi Williams · Portfolio

**Live site: [siliilagi.github.io](https://siliilagi.github.io/)**

Aloha! I'm Marley "Lagi" Williams, a Computer Science graduate from BYU–Hawaiʻi working in data analytics and operations. This is my portfolio site. I designed and built it from scratch to show my data projects as short case studies: the question, the data, what I did, and what I found.

## Featured projects

| Project | Tools | What it shows |
|---|---|---|
| [Health in Hawaiʻi: Income, Age and Who Is Left Behind](https://lookerstudio.google.com/reporting/14cd99ff-6dd2-4c8a-8dfa-9b0567dcf334) | Looker Studio, Google Sheets | CDC survey data for 6,636 Hawaiʻi adults. Fair or poor health is 28% in households under $25K vs 12% in the highest income band. |
| [Airbnb Dashboard](https://public.tableau.com/views/AirBnBFullProject_17895945228940/Dashboard1) | Tableau | Seattle listings by bedroom count and zip code, plus weekly revenue across 2016. |
| Tech-Moms Student Demographic Dashboard + SQL Analysis | Google Sheets, SQL, Deepnote | 1,681 applicants cleaned and analyzed: who applies, who enrolls, and what the missing answers hide. |
| [Bike Sales Dashboard](https://docs.google.com/spreadsheets/d/1QDPW3s2MvRyRhTOMOQvkH7ZSRyQgH_fdnIoPozsLoaQ/) | Google Sheets | 1,000 customer records. 48.1% bought a bike, and short commutes bought the most. |
| Ala Kukui Program Attendee Demographic Dashboard | Google Sheets | Attendee records back to 2016 consolidated into one self-updating dashboard for grant reports. Data is private. |

Full write-ups for each are on the [Projects page](https://siliilagi.github.io/projects.html).

## Built with

- HTML, CSS, and vanilla JavaScript, with no frameworks
- [anime.js](https://animejs.com/) for the hero and counter animations
- Google Fonts (Cormorant Garamond and DM Sans)
- Hosted on GitHub Pages

Site features include a shrinking hero header, typing animation, scroll reveals, a Featured Work strip on the homepage, filterable project cards, and case study popups that can be linked to directly (for example `projects.html?project=7`).

## How it's organized

```
index.html        Homepage: hero, About Me, Featured Work, Currently Working On
projects.html     All projects with filters and case study popups
experience.html   Work history and education
skills.html       Skills grouped by area
contact.html      Contact form and links
header.html       Shared nav, loaded into each page
footer.html       Shared footer, loaded into each page
main.js           All site behavior, plus the projects list
styles.css        All styles and color tokens
```

## Adding a project

Every project card, popup, and homepage feature comes from one list: `const projects` in `main.js`. To add one, copy the template at the bottom of that list and fill it in.

- `question`, `data`, `process`, and `findings` build the case study sections in the popup
- `image` shows a screenshot on the card and in the popup. Without one, `stat` shows a headline number instead
- `featured: true` puts the project on the homepage (I keep it to 3)
- `tags` need to match a filter button in `projects.html`

## Run it locally

Clone the repo and serve the folder. A local server is needed because the header and footer load with `fetch`, which doesn't work when you open the file directly.

```bash
git clone https://github.com/siliilagi/siliilagi.github.io.git
cd siliilagi.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact

- Email: [siliilagim@gmail.com](mailto:siliilagim@gmail.com)
- LinkedIn: [marley-williams](https://www.linkedin.com/in/marley-williams)
- GitHub: [siliilagi](https://github.com/siliilagi)

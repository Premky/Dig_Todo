import { Document, Packer, Table, TableRow, TableCell, Paragraph, WidthType } from "docx";
import { saveAs } from "file-saver";


const exportToWord = (emp, edu, train, award, decor, punishment, jd) => {
    const convertToNepaliDate = (isoDate) => {
        const datePart = isoDate.split('T')[0]; // Extract just the date part
        const englishToNepaliMap = {
            '0': '०',
            '1': '१',
            '2': '२',
            '3': '३',
            '4': '४',
            '5': '५',
            '6': '६',
            '7': '७',
            '8': '८',
            '9': '९',
        };

        // return datePart; // Return in the format needed for the NepaliDatePicker
        return datePart.split('').map(char => englishToNepaliMap[char] || char).join('');
    };

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({ text: "व्यक्तिगत विवरणः" }),
                    // First Table
                    new Table({
                        rows: emp.flatMap((row) => [
                            //First Row
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`कम्प्युटर कोडः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`${row.pmis}`)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`पुरा नाम:`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`${row.name_np}`)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`व्यक्तिगत नं.`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.personal_no)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`संकेत नं.`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.symbol_no)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            //Second Row
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`दर्जा`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.recruit_rank)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`जन्म मितिः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(convertToNepaliDate(row.dob))],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`नागरिकता नं.`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.ctz_no)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`जारी जिल्ला`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.issue_district)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`लैंगिक`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.gender)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`रक्त समुह`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.blood_group)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`स्थायी लेखा नं.`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.pan)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`संचय कोष`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.sanchay_kosh)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`नागलिक लगानी कोष`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.nalakosh)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`भर्ना दर्जा`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.recruit_rank)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [

                                    new TableCell({
                                        children: [new Paragraph(`भर्ना मितिः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.recruit_date)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`बढुवा मितिः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(convertToNepaliDate(row.dob))],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`उचाईः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.height)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`छातीः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.chest)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph(`हुलीयाः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.huliya)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`वर्णः`)],
                                        width: { size: 2000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(row.warna)],
                                        width: { size: 5000, type: WidthType.DXA }, // Set width to 3000 DXA for first column
                                    }),
                                ],
                            }),


                        ]),
                    }),

                    // Qualification Table
                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "शैक्षिक योग्यताः" }),
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('शैक्षिक योग्यता')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('श्रेणी')],
                                    }),
                                    new TableCell({
                                        width: { size: 4000, type: WidthType.DXA },
                                        children: [new Paragraph('शिक्षण संस्थाको नाम')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('उत्तिर्ण मिति')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...edu.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.edu_level)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.edu_rank)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.institute)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.pass_year))]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    // Training Table
                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "तालिमको विवरणः" }),
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('प्राप्त तालिमको विवरण')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('ग्रेड')],
                                    }),
                                    new TableCell({
                                        width: { size: 4000, type: WidthType.DXA },
                                        children: [new Paragraph('तालिम प्राप्त गरेको स्थान')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('समुह')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('सुरु मिति')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('समाप्त मिति')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...train.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.training)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.grade)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.training_center)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.batch)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.start_date))]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.end_date))]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    // Award or Prize Table
                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "पुरस्कारः" }),
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('पुरस्कारको विवरण')],
                                    }),
                                    new TableCell({
                                        width: { size: 3000, type: WidthType.DXA },
                                        children: [new Paragraph('पुरस्कार दिने कार्यालय')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('प्राप्त मिति')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('रकम(रु)/ग्रेड')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('चलानी नं.')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...award.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.office_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.date))]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.prize)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.sn)]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    //Decoration Table

                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "विभुषण" }),
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('विभुषणको विवरण')],
                                    }),
                                    new TableCell({
                                        width: { size: 3000, type: WidthType.DXA },
                                        children: [new Paragraph('विभुषण दिने कार्यालय')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('प्राप्त मिति')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('रकम(रु)/ग्रेड')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('चलानी नं.')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...decor.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.office_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.date))]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.prize)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.sn)]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    // Punishment Table
                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "कारवाही सम्बन्धी विवरण" }),
                    // Second Table
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 3000, type: WidthType.DXA },
                                        children: [new Paragraph('कारवाही गर्ने कार्यालय')],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('कारवाही किसिम')],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('चलानी नं.')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('मिति')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...punishment.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.office_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.type)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.sn)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.date))]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    // JD Table
                    new Paragraph({ text: " " }), // Add a space between tables
                    new Paragraph({ text: "नोकरी विवरण" }),

                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph(`सि.नं.`)],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('सेवा समुह')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('दर्जा')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('क्रियाकलाप')],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('न.नि. सरुवा/बढुवा गर्ने कार्यालय')],
                                    }),
                                    new TableCell({
                                        width: { size: 1000, type: WidthType.DXA },
                                        children: [new Paragraph('मिति')],
                                    }),
                                    new TableCell({
                                        width: { size: 2000, type: WidthType.DXA },
                                        children: [new Paragraph('दरबन्दी')],
                                    }),
                                ],
                            }),
                            //Second Row for Datas:
                            ...jd.map((row, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(`${index + 1}`)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.group_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.rank_np)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.job_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.office_name)]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(convertToNepaliDate(row.date))]
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(row.deputation)]
                                        }),
                                    ]
                                })
                            ),
                        ]
                    }),

                    //Add Next Table Here
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "tables.docx");
    });
};


export default exportToWord;
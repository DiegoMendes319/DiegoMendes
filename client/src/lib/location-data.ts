export interface LocationData {
  [province: string]: {
    name: string;
    municipalities: {
      [municipality: string]: {
        name: string;
        neighborhoods: string[];
      };
    };
  };
}

export const locationData: LocationData = {
  // 21 Provinces of Angola (2025 Update)
  luanda: {
    name: 'Luanda',
    municipalities: {
      ingombota: {
        name: 'Ingombota',
        neighborhoods: ['Maianga', 'Alvalade', 'Miramar', 'Patrice Lumumba', 'Kinanga', 'Prenda']
      },
      maianga: {
        name: 'Maianga',
        neighborhoods: ['Rangel', 'Operário', 'Kinanga', 'Prenda']
      },
      sambizanga: {
        name: 'Sambizanga',
        neighborhoods: ['Sambizanga', 'Operário', 'Ngola Kiluange', 'Cazenga']
      },
      kilamba_kiaxi: {
        name: 'Kilamba Kiaxi',
        neighborhoods: ['Kilamba', 'Golf', 'Camama', 'Benfica']
      },
      talatona: {
        name: 'Talatona',
        neighborhoods: ['Talatona', 'Benfica', 'Futungo', 'Luanda Sul']
      },
      viana: {
        name: 'Viana',
        neighborhoods: ['Viana', 'Calumbo', 'Kikolo', 'Zango']
      },
      cacuaco: {
        name: 'Cacuaco',
        neighborhoods: ['Cacuaco', 'Funda', 'Sequele', 'Kikolo']
      }
    }
  },
  icolo_bengo: {
    name: 'Icolo e Bengo',
    municipalities: {
      icolo: {
        name: 'Icolo',
        neighborhoods: ['Icolo', 'Catete', 'Bom Jesus', 'Cabo Ledo']
      },
      belas: {
        name: 'Belas',
        neighborhoods: ['Belas', 'Ramires', 'Cabolombo', 'Bengo']
      },
      quicama: {
        name: 'Quiçama',
        neighborhoods: ['Quiçama', 'Muxima', 'Cabo Ledo', 'Kissama']
      }
    }
  },
  bengo: {
    name: 'Bengo',
    municipalities: {
      caxito: {
        name: 'Caxito',
        neighborhoods: ['Caxito', 'Kikuxi', 'Mabubas', 'Úcua']
      },
      dande: {
        name: 'Dande',
        neighborhoods: ['Dande', 'Caxito', 'Barra do Dande', 'Quixico']
      },
      nambuangongo: {
        name: 'Nambuangongo',
        neighborhoods: ['Nambuangongo', 'Bolongongo', 'Gombe', 'Zala']
      },
      ambriz: {
        name: 'Ambriz',
        neighborhoods: ['Ambriz', 'Tabi', 'Quiage', 'Gombe']
      },
      dembos: {
        name: 'Dembos',
        neighborhoods: ['Dembos', 'Cassoneca', 'Paredes', 'Quixico']
      },
      pango_aluquem: {
        name: 'Pango Aluquém',
        neighborhoods: ['Pango Aluquém', 'Quiage', 'Muxaluando', 'Quiculo']
      }
    }
  },
  benguela: {
    name: 'Benguela',
    municipalities: {
      benguela: {
        name: 'Benguela',
        neighborhoods: ['Centro', 'Praia Morena', 'Compão', 'Caponte']
      },
      lobito: {
        name: 'Lobito',
        neighborhoods: ['Canata', 'Compão', 'Restinga', 'Caponte']
      },
      catumbela: {
        name: 'Catumbela',
        neighborhoods: ['Catumbela', 'Praia Azul', 'Equimina', 'Biopio']
      },
      cubal: {
        name: 'Cubal',
        neighborhoods: ['Cubal', 'Capupa', 'Tumbulo', 'Caiongo']
      },
      ganda: {
        name: 'Ganda',
        neighborhoods: ['Ganda', 'Balombo', 'Chindumbo', 'Ebanga']
      },
      bocoio: {
        name: 'Bocoio',
        neighborhoods: ['Bocoio', 'Chila', 'Passe', 'Cubal']
      },
      caimbambo: {
        name: 'Caimbambo',
        neighborhoods: ['Caimbambo', 'Catumbela', 'Dombe Grande', 'Cubal']
      },
      balombo: {
        name: 'Balombo',
        neighborhoods: ['Balombo', 'Chindongo', 'Maca', 'Cubal']
      },
      chongoroi: {
        name: 'Chongoroi',
        neighborhoods: ['Chongoroi', 'Cubal', 'Bocoio', 'Ganda']
      },
      chopera: {
        name: 'Chopera',
        neighborhoods: ['Chopera', 'Ganda', 'Ebanga', 'Balombo']
      }
    }
  },
  huambo: {
    name: 'Huambo',
    municipalities: {
      huambo: {
        name: 'Huambo',
        neighborhoods: ['Centro', 'Comala', 'Comercial', 'Tchioco']
      },
      bailundo: {
        name: 'Bailundo',
        neighborhoods: ['Bailundo', 'Bimbe', 'Lunge', 'Hanha']
      },
      cachiungo: {
        name: 'Cachiungo',
        neighborhoods: ['Cachiungo', 'Huambo', 'Bailundo', 'Ekuma']
      },
      caala: {
        name: 'Caála',
        neighborhoods: ['Caála', 'Catata', 'Calenga', 'Huambo']
      },
      ekunha: {
        name: 'Ekunha',
        neighborhoods: ['Ekunha', 'Caála', 'Mungo', 'Cachiungo']
      },
      londuimbali: {
        name: 'Londuimbali',
        neighborhoods: ['Londuimbali', 'Galanga', 'Ussoque', 'Bailundo']
      },
      longonjo: {
        name: 'Longonjo',
        neighborhoods: ['Longonjo', 'Alto Hama', 'Chilata', 'Galanga']
      },
      mungo: {
        name: 'Mungo',
        neighborhoods: ['Mungo', 'Ekunha', 'Caála', 'Longonjo']
      },
      chinjenje: {
        name: 'Chinjenje',
        neighborhoods: ['Chinjenje', 'Longonjo', 'Galanga', 'Ussoque']
      },
      ucuma: {
        name: 'Ucuma',
        neighborhoods: ['Ucuma', 'Cachiungo', 'Ekunha', 'Mungo']
      },
      chicala_choloanga: {
        name: 'Chicala-Choloanga',
        neighborhoods: ['Chicala-Choloanga', 'Bailundo', 'Londuimbali', 'Galanga']
      }
    }
  },
  huila: {
    name: 'Huíla',
    municipalities: {
      lubango: {
        name: 'Lubango',
        neighborhoods: ['Centro', 'Comercial', 'Tchidia', 'Arimba']
      },
      matala: {
        name: 'Matala',
        neighborhoods: ['Matala', 'Mulondo', 'Capunda', 'Quihita']
      },
      chibia: {
        name: 'Chibia',
        neighborhoods: ['Chibia', 'Jamba', 'Quipungo', 'Humpata']
      },
      humpata: {
        name: 'Humpata',
        neighborhoods: ['Humpata', 'Chibia', 'Lubango', 'Galangue']
      },
      quilengues: {
        name: 'Quilengues',
        neighborhoods: ['Quilengues', 'Matala', 'Jamba', 'Impulo']
      },
      quipungo: {
        name: 'Quipungo',
        neighborhoods: ['Quipungo', 'Chibia', 'Humpata', 'Lubango']
      },
      cacula: {
        name: 'Cacula',
        neighborhoods: ['Cacula', 'Quilengues', 'Matala', 'Jamba']
      },
      caconda: {
        name: 'Caconda',
        neighborhoods: ['Caconda', 'Cacula', 'Quilengues', 'Chiange']
      },
      jamba: {
        name: 'Jamba',
        neighborhoods: ['Jamba', 'Chibia', 'Quipungo', 'Humpata']
      },
      gambos: {
        name: 'Gambos',
        neighborhoods: ['Gambos', 'Chiange', 'Cacula', 'Quilengues']
      },
      cuvango: {
        name: 'Cuvango',
        neighborhoods: ['Cuvango', 'Gambos', 'Chiange', 'Jamba']
      },
      chiange: {
        name: 'Chiange',
        neighborhoods: ['Chiange', 'Caconda', 'Cuvango', 'Gambos']
      },
      chipindo: {
        name: 'Chipindo',
        neighborhoods: ['Chipindo', 'Cuvango', 'Gambos', 'Chiange']
      },
      galangue: {
        name: 'Galangue',
        neighborhoods: ['Galangue', 'Humpata', 'Lubango', 'Chibia']
      }
    }
  },
  uige: {
    name: 'Uíge',
    municipalities: {
      uige: {
        name: 'Uíge',
        neighborhoods: ['Centro', 'Kimongo', 'Sagrada Família', 'Negage']
      },
      negage: {
        name: 'Negage',
        neighborhoods: ['Negage', 'Uíge', 'Mucaba', 'Songo']
      },
      mucaba: {
        name: 'Mucaba',
        neighborhoods: ['Mucaba', 'Negage', 'Uíge', 'Songo']
      },
      songo: {
        name: 'Songo',
        neighborhoods: ['Songo', 'Negage', 'Mucaba', 'Quitexe']
      },
      quitexe: {
        name: 'Quitexe',
        neighborhoods: ['Quitexe', 'Songo', 'Mucaba', 'Bungo']
      },
      bungo: {
        name: 'Bungo',
        neighborhoods: ['Bungo', 'Quitexe', 'Songo', 'Cangola']
      },
      cangola: {
        name: 'Cangola',
        neighborhoods: ['Cangola', 'Bungo', 'Quitexe', 'Zombo']
      },
      zombo: {
        name: 'Zombo',
        neighborhoods: ['Zombo', 'Cangola', 'Bungo', 'Milunga']
      },
      milunga: {
        name: 'Milunga',
        neighborhoods: ['Milunga', 'Zombo', 'Cangola', 'Puri']
      },
      puri: {
        name: 'Puri',
        neighborhoods: ['Puri', 'Milunga', 'Zombo', 'Bembe']
      },
      bembe: {
        name: 'Bembe',
        neighborhoods: ['Bembe', 'Puri', 'Milunga', 'Damba']
      },
      damba: {
        name: 'Damba',
        neighborhoods: ['Damba', 'Bembe', 'Puri', 'Sanza Pombo']
      },
      sanza_pombo: {
        name: 'Sanza Pombo',
        neighborhoods: ['Sanza Pombo', 'Damba', 'Bembe', 'Alto Cauale']
      },
      alto_cauale: {
        name: 'Alto Cauale',
        neighborhoods: ['Alto Cauale', 'Sanza Pombo', 'Damba', 'Quimbele']
      },
      quimbele: {
        name: 'Quimbele',
        neighborhoods: ['Quimbele', 'Alto Cauale', 'Sanza Pombo', 'Maquela']
      },
      maquela: {
        name: 'Maquela do Zombo',
        neighborhoods: ['Maquela do Zombo', 'Quimbele', 'Alto Cauale', 'Uíge']
      }
    }
  },
  bie: {
    name: 'Bié',
    municipalities: {
      kuito: {
        name: 'Kuito',
        neighborhoods: ['Centro', 'Trumba', 'Cacolo', 'Catabola']
      },
      andulo: {
        name: 'Andulo',
        neighborhoods: ['Andulo', 'Kuito', 'Nharea', 'Catabola']
      },
      nharea: {
        name: 'Nharea',
        neighborhoods: ['Nharea', 'Andulo', 'Kuito', 'Cunhinga']
      },
      cunhinga: {
        name: 'Cunhinga',
        neighborhoods: ['Cunhinga', 'Nharea', 'Andulo', 'Catabola']
      },
      catabola: {
        name: 'Catabola',
        neighborhoods: ['Catabola', 'Kuito', 'Andulo', 'Cunhinga']
      },
      camacupa: {
        name: 'Camacupa',
        neighborhoods: ['Camacupa', 'Catabola', 'Kuito', 'Chinguar']
      },
      chinguar: {
        name: 'Chinguar',
        neighborhoods: ['Chinguar', 'Camacupa', 'Catabola', 'Chitembo']
      },
      chitembo: {
        name: 'Chitembo',
        neighborhoods: ['Chitembo', 'Chinguar', 'Camacupa', 'Cuemba']
      },
      cuemba: {
        name: 'Cuemba',
        neighborhoods: ['Cuemba', 'Chitembo', 'Chinguar', 'Kuito']
      }
    }
  },
  cabinda: {
    name: 'Cabinda',
    municipalities: {
      cabinda: {
        name: 'Cabinda',
        neighborhoods: ['Centro', 'Tchiowa', 'Simulambuco', 'Malembo']
      },
      buco_zau: {
        name: 'Buco Zau',
        neighborhoods: ['Buco Zau', 'Necuto', 'Inhuca', 'Cabinda']
      },
      belize: {
        name: 'Belize',
        neighborhoods: ['Belize', 'Cabinda', 'Buco Zau', 'Cacongo']
      },
      cacongo: {
        name: 'Cacongo',
        neighborhoods: ['Cacongo', 'Belize', 'Cabinda', 'Landana']
      }
    }
  },
  cuanza_norte: {
    name: 'Cuanza Norte',
    municipalities: {
      ndalatando: {
        name: 'N\'dalatando',
        neighborhoods: ['Centro', 'Cambamba', 'Bolongongo', 'Cazengo']
      },
      cazengo: {
        name: 'Cazengo',
        neighborhoods: ['Cazengo', 'N\'dalatando', 'Lucala', 'Golungo Alto']
      },
      golungo_alto: {
        name: 'Golungo Alto',
        neighborhoods: ['Golungo Alto', 'Cazengo', 'N\'dalatando', 'Lucala']
      },
      lucala: {
        name: 'Lucala',
        neighborhoods: ['Lucala', 'Golungo Alto', 'Cazengo', 'Quiculungo']
      },
      quiculungo: {
        name: 'Quiculungo',
        neighborhoods: ['Quiculungo', 'Lucala', 'Golungo Alto', 'Samba Caju']
      },
      samba_caju: {
        name: 'Samba Caju',
        neighborhoods: ['Samba Caju', 'Quiculungo', 'Lucala', 'Banga']
      },
      banga: {
        name: 'Banga',
        neighborhoods: ['Banga', 'Samba Caju', 'Quiculungo', 'Ambaca']
      },
      ambaca: {
        name: 'Ambaca',
        neighborhoods: ['Ambaca', 'Banga', 'Samba Caju', 'Bolongongo']
      },
      bolongongo: {
        name: 'Bolongongo',
        neighborhoods: ['Bolongongo', 'Ambaca', 'Banga', 'Cambambe']
      },
      cambambe: {
        name: 'Cambambe',
        neighborhoods: ['Cambambe', 'Bolongongo', 'Ambaca', 'N\'dalatando']
      }
    }
  },
  cuanza_sul: {
    name: 'Cuanza Sul',
    municipalities: {
      sumbe: {
        name: 'Sumbe',
        neighborhoods: ['Centro', 'Gunza', 'Quicombo', 'Conda']
      },
      porto_amboim: {
        name: 'Porto Amboim',
        neighborhoods: ['Porto Amboim', 'Sumbe', 'Quicombo', 'Gabela']
      },
      gabela: {
        name: 'Gabela',
        neighborhoods: ['Gabela', 'Porto Amboim', 'Sumbe', 'Seles']
      },
      seles: {
        name: 'Seles',
        neighborhoods: ['Seles', 'Gabela', 'Porto Amboim', 'Amboim']
      },
      amboim: {
        name: 'Amboim',
        neighborhoods: ['Amboim', 'Seles', 'Gabela', 'Conda']
      },
      conda: {
        name: 'Conda',
        neighborhoods: ['Conda', 'Amboim', 'Seles', 'Ebo']
      },
      ebo: {
        name: 'Ebo',
        neighborhoods: ['Ebo', 'Conda', 'Amboim', 'Libolo']
      },
      libolo: {
        name: 'Libolo',
        neighborhoods: ['Libolo', 'Ebo', 'Conda', 'Mussende']
      },
      mussende: {
        name: 'Mussende',
        neighborhoods: ['Mussende', 'Libolo', 'Ebo', 'Quibala']
      },
      quibala: {
        name: 'Quibala',
        neighborhoods: ['Quibala', 'Mussende', 'Libolo', 'Waku Kungo']
      },
      waku_kungo: {
        name: 'Waku Kungo',
        neighborhoods: ['Waku Kungo', 'Quibala', 'Mussende', 'Cassongue']
      },
      cassongue: {
        name: 'Cassongue',
        neighborhoods: ['Cassongue', 'Waku Kungo', 'Quibala', 'Sumbe']
      }
    }
  },
  cunene: {
    name: 'Cunene',
    municipalities: {
      ondjiva: {
        name: 'Ondjiva',
        neighborhoods: ['Centro', 'Nehone', 'Evale', 'Xangongo']
      },
      cuvelai: {
        name: 'Cuvelai',
        neighborhoods: ['Cuvelai', 'Ondjiva', 'Nehone', 'Evale']
      },
      cahama: {
        name: 'Cahama',
        neighborhoods: ['Cahama', 'Cuvelai', 'Ondjiva', 'Ombadja']
      },
      ombadja: {
        name: 'Ombadja',
        neighborhoods: ['Ombadja', 'Cahama', 'Cuvelai', 'Curoca']
      },
      curoca: {
        name: 'Curoca',
        neighborhoods: ['Curoca', 'Ombadja', 'Cahama', 'Namacunde']
      },
      namacunde: {
        name: 'Namacunde',
        neighborhoods: ['Namacunde', 'Curoca', 'Ombadja', 'Ondjiva']
      }
    }
  },
  lunda_norte: {
    name: 'Lunda Norte',
    municipalities: {
      dundo: {
        name: 'Dundo',
        neighborhoods: ['Centro', 'Chitato', 'Capenda', 'Lucapa']
      },
      chitato: {
        name: 'Chitato',
        neighborhoods: ['Chitato', 'Dundo', 'Capenda', 'Lucapa']
      },
      capenda: {
        name: 'Capenda-Camulemba',
        neighborhoods: ['Capenda-Camulemba', 'Chitato', 'Dundo', 'Cambulo']
      },
      cambulo: {
        name: 'Cambulo',
        neighborhoods: ['Cambulo', 'Capenda-Camulemba', 'Chitato', 'Lucapa']
      },
      lucapa: {
        name: 'Lucapa',
        neighborhoods: ['Lucapa', 'Cambulo', 'Capenda-Camulemba', 'Xa Muteba']
      },
      xa_muteba: {
        name: 'Xa-Muteba',
        neighborhoods: ['Xa-Muteba', 'Lucapa', 'Cambulo', 'Cuango']
      },
      cuango: {
        name: 'Cuango',
        neighborhoods: ['Cuango', 'Xa-Muteba', 'Lucapa', 'Caungula']
      },
      caungula: {
        name: 'Caungula',
        neighborhoods: ['Caungula', 'Cuango', 'Xa-Muteba', 'Lubalo']
      },
      lubalo: {
        name: 'Lubalo',
        neighborhoods: ['Lubalo', 'Caungula', 'Cuango', 'Dundo']
      }
    }
  },
  lunda_sul: {
    name: 'Lunda Sul',
    municipalities: {
      saurimo: {
        name: 'Saurimo',
        neighborhoods: ['Centro', 'Muconda', 'Cacolo', 'Dala']
      },
      muconda: {
        name: 'Muconda',
        neighborhoods: ['Muconda', 'Saurimo', 'Cacolo', 'Dala']
      },
      cacolo: {
        name: 'Cacolo',
        neighborhoods: ['Cacolo', 'Muconda', 'Saurimo', 'Dala']
      },
      dala: {
        name: 'Dala',
        neighborhoods: ['Dala', 'Cacolo', 'Muconda', 'Saurimo']
      }
    }
  },
  malanje: {
    name: 'Malanje',
    municipalities: {
      malanje: {
        name: 'Malanje',
        neighborhoods: ['Centro', 'Cacuso', 'Calandula', 'Cangandala']
      },
      cacuso: {
        name: 'Cacuso',
        neighborhoods: ['Cacuso', 'Malanje', 'Calandula', 'Cangandala']
      },
      calandula: {
        name: 'Calandula',
        neighborhoods: ['Calandula', 'Cacuso', 'Malanje', 'Cambundi']
      },
      cambundi: {
        name: 'Cambundi-Catembo',
        neighborhoods: ['Cambundi-Catembo', 'Calandula', 'Cacuso', 'Cangandala']
      },
      cangandala: {
        name: 'Cangandala',
        neighborhoods: ['Cangandala', 'Cambundi-Catembo', 'Calandula', 'Cuaba Nzogo']
      },
      cuaba_nzogo: {
        name: 'Cuaba Nzogo',
        neighborhoods: ['Cuaba Nzogo', 'Cangandala', 'Cambundi-Catembo', 'Luquembo']
      },
      luquembo: {
        name: 'Luquembo',
        neighborhoods: ['Luquembo', 'Cuaba Nzogo', 'Cangandala', 'Massango']
      },
      massango: {
        name: 'Massango',
        neighborhoods: ['Massango', 'Luquembo', 'Cuaba Nzogo', 'Mucari']
      },
      mucari: {
        name: 'Mucari',
        neighborhoods: ['Mucari', 'Massango', 'Luquembo', 'Quela']
      },
      quela: {
        name: 'Quela',
        neighborhoods: ['Quela', 'Mucari', 'Massango', 'Quirima']
      },
      quirima: {
        name: 'Quirima',
        neighborhoods: ['Quirima', 'Quela', 'Mucari', 'Marimba']
      },
      marimba: {
        name: 'Marimba',
        neighborhoods: ['Marimba', 'Quirima', 'Quela', 'Kiwaba Nzoji']
      },
      kiwaba_nzoji: {
        name: 'Kiwaba Nzoji',
        neighborhoods: ['Kiwaba Nzoji', 'Marimba', 'Quirima', 'Malanje']
      },
      kunda_dia_base: {
        name: 'Kunda-dia-Base',
        neighborhoods: ['Kunda-dia-Base', 'Kiwaba Nzoji', 'Marimba', 'Malanje']
      }
    }
  },
  moxico: {
    name: 'Moxico',
    municipalities: {
      luena: {
        name: 'Luena',
        neighborhoods: ['Centro', 'Luau', 'Camanongue', 'Lucusse']
      },
      luau: {
        name: 'Luau',
        neighborhoods: ['Luau', 'Luena', 'Camanongue', 'Lucusse']
      },
      camanongue: {
        name: 'Camanongue',
        neighborhoods: ['Camanongue', 'Luau', 'Luena', 'Lucusse']
      },
      lucusse: {
        name: 'Lucusse',
        neighborhoods: ['Lucusse', 'Camanongue', 'Luau', 'Luacano']
      },
      luacano: {
        name: 'Luacano',
        neighborhoods: ['Luacano', 'Lucusse', 'Camanongue', 'Bundas']
      },
      bundas: {
        name: 'Bundas',
        neighborhoods: ['Bundas', 'Luacano', 'Lucusse', 'Léua']
      },
      leua: {
        name: 'Léua',
        neighborhoods: ['Léua', 'Bundas', 'Luacano', 'Cameia']
      },
      cameia: {
        name: 'Cameia',
        neighborhoods: ['Cameia', 'Léua', 'Bundas', 'Alto Zambeze']
      },
      alto_zambeze: {
        name: 'Alto Zambeze',
        neighborhoods: ['Alto Zambeze', 'Cameia', 'Léua', 'Luena']
      }
    }
  },
  moxico_leste: {
    name: 'Moxico Leste',
    municipalities: {
      cassai_zambeze: {
        name: 'Cassai Zambeze',
        neighborhoods: ['Cassai Zambeze', 'Cazombo', 'Mucusso', 'Rivungo']
      },
      cazombo: {
        name: 'Cazombo',
        neighborhoods: ['Cazombo', 'Cassai Zambeze', 'Mucusso', 'Rivungo']
      },
      mucusso: {
        name: 'Mucusso',
        neighborhoods: ['Mucusso', 'Cazombo', 'Cassai Zambeze', 'Rivungo']
      },
      rivungo: {
        name: 'Rivungo',
        neighborhoods: ['Rivungo', 'Mucusso', 'Cazombo', 'Cassai Zambeze']
      }
    }
  },
  namibe: {
    name: 'Namibe',
    municipalities: {
      namibe: {
        name: 'Namibe',
        neighborhoods: ['Centro', 'Tombua', 'Lucira', 'Bibala']
      },
      tombua: {
        name: 'Tombua',
        neighborhoods: ['Tombua', 'Namibe', 'Lucira', 'Bibala']
      },
      lucira: {
        name: 'Lucira',
        neighborhoods: ['Lucira', 'Tombua', 'Namibe', 'Bibala']
      },
      bibala: {
        name: 'Bibala',
        neighborhoods: ['Bibala', 'Lucira', 'Tombua', 'Camucuio']
      },
      camucuio: {
        name: 'Camucuio',
        neighborhoods: ['Camucuio', 'Bibala', 'Lucira', 'Namibe']
      }
    }
  },
  cuando_cubango: {
    name: 'Cuando Cubango',
    municipalities: {
      menongue: {
        name: 'Menongue',
        neighborhoods: ['Centro', 'Cuito Cuanavale', 'Dirico', 'Mavinga']
      },
      cuito_cuanavale: {
        name: 'Cuito Cuanavale',
        neighborhoods: ['Cuito Cuanavale', 'Menongue', 'Dirico', 'Mavinga']
      },
      dirico: {
        name: 'Dirico',
        neighborhoods: ['Dirico', 'Cuito Cuanavale', 'Menongue', 'Mavinga']
      },
      mavinga: {
        name: 'Mavinga',
        neighborhoods: ['Mavinga', 'Dirico', 'Cuito Cuanavale', 'Rivungo']
      },
      rivungo: {
        name: 'Rivungo',
        neighborhoods: ['Rivungo', 'Mavinga', 'Dirico', 'Nancova']
      },
      nancova: {
        name: 'Nancova',
        neighborhoods: ['Nancova', 'Rivungo', 'Mavinga', 'Menongue']
      }
    }
  },
  cuando: {
    name: 'Cuando',
    municipalities: {
      calai: {
        name: 'Calai',
        neighborhoods: ['Calai', 'Cuangar', 'Longa', 'Mucusso']
      },
      cuangar: {
        name: 'Cuangar',
        neighborhoods: ['Cuangar', 'Calai', 'Longa', 'Mucusso']
      },
      longa: {
        name: 'Longa',
        neighborhoods: ['Longa', 'Cuangar', 'Calai', 'Mucusso']
      },
      mucusso: {
        name: 'Mucusso',
        neighborhoods: ['Mucusso', 'Longa', 'Cuangar', 'Calai']
      }
    }
  },
  zaire: {
    name: 'Zaire',
    municipalities: {
      mbanza_congo: {
        name: 'Mbanza Congo',
        neighborhoods: ['Centro', 'Soyo', 'Nzeto', 'Tomboco']
      },
      soyo: {
        name: 'Soyo',
        neighborhoods: ['Soyo', 'Mbanza Congo', 'Nzeto', 'Tomboco']
      },
      nzeto: {
        name: 'Nzeto',
        neighborhoods: ['Nzeto', 'Soyo', 'Mbanza Congo', 'Cuimba']
      },
      cuimba: {
        name: 'Cuimba',
        neighborhoods: ['Cuimba', 'Nzeto', 'Soyo', 'Tomboco']
      },
      tomboco: {
        name: 'Tomboco',
        neighborhoods: ['Tomboco', 'Cuimba', 'Nzeto', 'Nóqui']
      },
      noqui: {
        name: 'Nóqui',
        neighborhoods: ['Nóqui', 'Tomboco', 'Cuimba', 'Mbanza Congo']
      }
    }
  }
};

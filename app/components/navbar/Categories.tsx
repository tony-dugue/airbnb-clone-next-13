'use client';

import { TbBeach, TbPool } from 'react-icons/tb';
import {  GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland,GiWindmill, GiFarmTractor } from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import Container from "../Container";
import CategoryBox from '../CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';

export const categories = [
  { id: 1, label: 'Plages', icon: TbBeach, description: 'Cette propriété est proche de la plage!' },
  { id: 2, label: 'Moulins à vent', icon: GiWindmill, description: 'Cette propriété a des moulins à vent!' },
  { id: 3, label: 'Moderne', icon: MdOutlineVilla, description: 'Cette propriété est moderne!' },
  { id: 4, label: 'Campagne', icon: GiFarmTractor, description: 'Cette propriété est à la campagne!' },
  { id: 5, label: 'Piscines', icon: TbPool, description: 'Cette propriété a une belle piscine!' },
  { id: 6, label: 'Iles', icon: GiIsland, description: 'Cette propriété est sur une île!' },
  { id: 7, label: 'Bord de lac', icon: GiBoatFishing, description: "Cette propriété est à proximité d'un lac!" },
  { id: 8, label: 'Ski', icon: FaSkiing, description: 'Cette propriété propose des activités de ski!' },
  { id: 9, label: 'Chateaux', icon: GiCastle, description: 'Cette propriété est un ancien château!' },
  { id: 10, label: 'Grottes', icon: GiCaveEntrance, description: 'Cette propriété est dans une grotte!' },
  { id: 11, label: 'Camping', icon: GiForestCamp, description: 'Cet établissement propose des activités de camping!' },
  { id: 12, label: 'Arctique', icon: BsSnow, description: 'Cette propriété est en milieu arctique!' },
  { id: 13, label: 'Désert', icon: GiCactus, description: 'Cette propriété est dans le désert!' },
  { id: 14, label: 'Granges', icon: GiBarn, description: 'Cette propriété est dans une grange!' },
  { id: 15, label: 'Luxe', icon: IoDiamond, description: 'Cette propriété est toute neuve et luxueuse!' }
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return(
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox 
            key={item.id}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  )
}

export default Categories;

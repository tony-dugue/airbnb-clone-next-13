"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import qs from 'query-string';
import { formatISO } from 'date-fns';

import useSearchModal from "@/app/hooks/useSearchModal";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";

import Modal from "./Modal";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import Calendar from "../inputs/Calendar";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(() => dynamic(() => import("../Map"), { 
    ssr: false 
  }), [location]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({ url: '/', query: updatedQuery }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);

  }, [step, searchModal, location, router, guestCount, roomCount, dateRange, onNext, bathroomCount, params]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Rechercher'
    }
    return 'Suivant'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }
    return 'Back'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Où voulez-vous aller ?" subtitle="Trouvez l'emplacement idéal !" />
      <CountrySelect value={location} onChange={(value) => setLocation(value as CountrySelectValue)} />
      <hr />
      <Map center={location?.latlng} />
    </div>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Quand comptez-vous partir ?" subtitle="Assurez-vous que tout le monde soit libre!" />
        <Calendar onChange={(value) => setDateRange(value.selection)} value={dateRange} />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Plus d'information" subtitle="Trouver l'endroit parfait !" />
        <Counter onChange={(value) => setGuestCount(value)} value={guestCount} title="invités" subtitle="Combien d'invités viendront ?" />
        <hr />
        <Counter onChange={(value) => setRoomCount(value)} value={roomCount} title="Chambres" subtitle="Combien de chambres ?" />        
        <hr />
        <Counter onChange={(value) => {setBathroomCount(value)}} value={bathroomCount} title="Salles de bains" subtitle="Combien de salles de bains ?" />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      title="Filtres"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default SearchModal;

"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

const LoginModal = () => {
  const router = useRouter();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);

  // React-use-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', { 
      ...data, 
      redirect: false,
    })
    .then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh();
        loginModal.onClose();
      }
      
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Bienvenue sur Airbnb" subtitle="Connecter-vous à votre compte !" />

      <Input
        id="email"
        label="Adresse e-mail"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="Mot de passe"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button outline label="Continuer avec Google" icon={FcGoogle} onClick={() => signIn('google')} />
      <Button outline label="Continuer avec Github" icon={AiFillGithub} onClick={() => signIn('github')}/>

      <div className=" text-neutral-500 text-center mt-4 font-light">
        <p>Première fois sur Airbnb ? <span onClick={onToggle} className="text-neutral-800 cursor-pointer hover:underline"> Créer un compte</span></p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Connexion"
      actionLabel="Continuer"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;

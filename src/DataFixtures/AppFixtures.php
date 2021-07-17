<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class AppFixtures
 * @package App\DataFixtures
 */
class AppFixtures extends Fixture
{

    private UserPasswordEncoderInterface $encodeur;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encodeur = $encoder;
    }

    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');
        for ($nbUser = 0; $nbUser < 10; $nbUser++) {
            $user = new User();
            $chrono = 1;
            $hash = $this->encodeur->encodePassword($user, 'password');

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName())
                ->setEmail($faker->email())
                ->setPassword($hash);


            $manager->persist($user);

            for ($nbCustomer = 0; $nbCustomer < mt_rand(0, 20); $nbCustomer++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName())
                    ->setCompany($faker->company())
                    ->setEmail($faker->email())
                    ->setUser($user);

                $manager->persist($customer);

                for ($nbInvoice = 0; $nbInvoice < mt_rand(0, 10); $nbInvoice++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setChrono($chrono)
                        ->setCustomer($customer);

                    $manager->persist($invoice);
                    $chrono++;
                }
            }
        }

        $manager->flush();
    }
}

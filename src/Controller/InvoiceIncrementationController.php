<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;



class InvoiceIncrementationController
{

    private EntityManagerInterface $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @param Invoice $data
     * @return Invoice
     */
    public function __invoke(Invoice $data): Invoice
    {
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();
        return $data;
    }
}

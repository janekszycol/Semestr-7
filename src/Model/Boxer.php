<?php
namespace App\Model;

use App\Service\Config;

class Boxer
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $weight = null;
    private ?string $record = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Boxer
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Boxer
    {
        $this->name = $name;
        return $this;
    }

    public function getWeight(): ?string
    {
        return $this->weight;
    }

    public function setWeight(?string $weight): Boxer
    {
        $this->weight = $weight;
        return $this;
    }

    public function getRecord(): ?string
    {
        return $this->record;
    }

    public function setRecord(?string $record): Boxer
    {
        $this->record = $record;
        return $this;
    }

    public static function fromArray($array): Boxer
    {
        $boxer = new self();
        $boxer->fill($array);
        return $boxer;
    }

    public function fill($array): Boxer
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['weight'])) {
            $this->setWeight($array['weight']);
        }
        if (isset($array['record'])) {
            $this->setRecord($array['record']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM boxer';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $boxers = [];
        $boxersArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($boxersArray as $boxerArray) {
            $boxers[] = self::fromArray($boxerArray);
        }

        return $boxers;
    }

    public static function find($id): ?Boxer
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM boxer WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $boxerArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$boxerArray) {
            return null;
        }
        return Boxer::fromArray($boxerArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO boxer (name, weight, record) VALUES (:name, :weight, :record)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'weight' => $this->getWeight(),
                'record' => $this->getRecord(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE boxer SET name = :name, weight = :weight, record = :record WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':weight' => $this->getWeight(),
                ':record' => $this->getRecord(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM boxer WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setWeight(null);
        $this->setRecord(null);
    }
}